<?php
date_default_timezone_set('Europe/Paris');

// On charge le framework Silex
require_once 'silex/vendor/autoload.php';

// On définit des noms utiles
use Silex\Application;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation as HTTP;

// On crée l'application et on la configure en mode debug
$app = new Application();
$app['debug'] = true;

$app->register(new Silex\Provider\SessionServiceProvider());
$app->register(new Silex\Provider\TwigServiceProvider(), 
               array('twig.path' => 'templates'));
$app->register(new Silex\Provider\DoctrineServiceProvider(),
  array('db.options' => array(
        'driver'   => 'pdo_mysql',
        'host'     => getenv('IP'),  // pas touche à ça.: spécifique pour C9.!
        'user'     => substr(getenv('C9_USER'), 0, 16),  // laissez comme ça, ou mettez
                                                         // votre login à la place
        'password' => '',
        'dbname' => 'c9'  // mettez ici le nom de la base de données
  )));
   
  
  
  
$app->match("/",function(Application $app,Request $req){
    
    $metode_formulaire=$req->getmethod();/*****************************/
    if($metode_formulaire=='GET') return $app['twig']->render("calendrier.html",array("time"=>strtotime("Monday") ,"level"=>$app['session']->get('level') , "calendrier"=>"test" ) ); //date("Y-m-d H:i:s")
    

    $date_debut_evenement=$req->get("date_debut_evenement");
    $date_fin_evenement=$req->get("date_fin_evenement");
    
    $titre=htmlspecialchars( $req->get("titre") ); 
    $calendrier=htmlspecialchars( $req->get("calendrier") );
    
    $description=htmlspecialchars( $req->get("description") );
    
    $time=$req->get("time");
    
    $type=$req->get("type");
    $id_event=$req->get("id_event");
    
        try{
            if($type==0){
                $q=$app['db']->prepare("INSERT INTO events (title_calendrier,title_event,date_start,date_end,description,creator)
                                    VALUES(?,?,?,?,?,?)");
                $q->execute( array( $calendrier , $titre , $date_debut_evenement , $date_fin_evenement , $description , $app['session']->get('login') )  );
            }
            elseif($type==1){
                $q=$app['db']->executeUpdate("UPDATE events SET title_event=?,description=? 
                                                    WHERE id_event=?",array( $titre , $description , $id_event ) );
            }
            elseif($type==2){
                $q=$app['db']->executeUpdate("DELETE FROM events WHERE id_event=?",array( $id_event ) );
            }
            



        $q=$app['db']->executeUpdate("UPDATE modif SET valeur=valeur+1 WHERE title_calendrier=?",array( $calendrier ) );
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/?error=19");
    }
    
    return $app['twig']->render("calendrier.html",array("time"=>$time ,"level"=>$app['session']->get('level') , "calendrier"=>$calendrier ) );
    
});



$app->match("/signup",function(Application $app,Request $req){
    
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=='GET') return $app['twig']->render("signup.html",array() );
    
    $login=htmlspecialchars( $req->get('login') );
    $password1=$req->get('password1');
    $password2=$req->get('password2');
    $droit=$req->get('droit');
    $r_create=0;
    $r_update=0;
    $r_delete=0;
    
    foreach($droit as $var){
        if($var=='create') $r_create=1;
        if($var=='update') $r_update=1;
        if($var=='delete') $r_delete=1;
    }
    
    if( $login=="" || $password1!=$password2 ) $app->redirect("/?error=2");
    $password=sha1($password1);
    
    try{
        $q=$app['db']->prepare("INSERT INTO users (login,password,level,r_create,r_update,r_delete,date_create)
                                    VALUES(?,?,?,?,?,?,?)");
        $q->execute( array($login,$password,0,$r_create,$r_update,$r_delete,date("Y-m-d H:i:s") ) );
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/?error=3");
    }
    
    return $app->redirect("/");
});




$app->match("/compte",function(Application $app,Request $req){ 
    $metode_formulaire=$req->getmethod();
    $level=$app['session']->get('level');
    if($level==null) return $app['twig']->render("/",array() );
    if($metode_formulaire=="GET") return $app['twig']->render("compte.html",array() );

    $id=$app['session']->get('id');
    $password=$app['session']->get('password');
    $password1=sha1( $req->get('password1') );    
    $password2=$req->get('password2');
    $password3=$req->get('password3');

    if($password1!=$password || $password2!=$password3) return $app->redirect("/compte?error=12");
        $password2=sha1($password2);
            try{
            $q=$app['db']->executeUpdate("UPDATE users SET password=? WHERE id_user=?",array($password2,$id));
            }catch(Doctrine\DBAL\DBALException $e){
                return $app->redirect("/compte?error=13");
            }
    $app['session']->set('password',$password2);
    return $app->redirect("/compte");
    

});





$app->match("/propos",function(Application $app,Request $req){
    return $app['twig']->render("propos.html",array() );
});







$app->match("/signin",function(Application $app,Request $req){
    
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=='GET') return $app->redirect("/");
    
    $login=htmlspecialchars( $req->get('login') );
    $password=sha1( $req->get('password') );
    $sql="SELECT * FROM users WHERE login='$login'";
    
    
    try{
        $reponse=$app['db']->executeQuery($sql)->fetch();
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/?error=15");  
    }
    
    if($reponse['password']!=$password) return $app->redirect("/?error=1");
    
    //c'est correct on cree la session
    $app['session']->set('lastco',$reponse['lastco']);
            try{
                $q=$app['db']->executeUpdate("UPDATE users SET lastco=? WHERE id_user=?",array( date("Y-m-d H:i:s") ,$reponse['id_user']) );
            }catch(Doctrine\DBAL\DBALException $e){
                return $app->redirect("/?error=17");  
            }
    $level=$reponse['level'];
    $r_update=$reponse['r_update'];
    $r_create=$reponse['r_create'];
    $r_delete=$reponse['r_delete'];
    $id=$reponse['id_user'];
    $password=$reponse['password'];
    $date_create=$reponse['date_create'];
    
    $app['session']->set('login',$login);
    $app['session']->set('r_update',$r_update);
    $app['session']->set('r_create',$r_create);
    $app['session']->set('r_delete',$r_delete);
    $app['session']->set('level',$level);
    $app['session']->set('id',$id);
    $app['session']->set('date_create',$date_create);
    $app['session']->set('password',$password); //mdp hashé
    
    return $app->redirect('/');
    
});




$app->match("/administration",function(Application $app,Request $req){
    if( $app['session']->get('level')!=2 ) return $app->redirect("/");
    return $app['twig']->render('administration.html',array() );
});





$app->match("/recherche_utilisateur",function(Application $app, Request $req){
    
    if($app['session']->get('level')!=2) return $app->redirect('/');

    $login= htmlspecialchars( $req->query->get("r") );
    $r_create= htmlspecialchars( $req->query->get("r_create") );
    $r_update= htmlspecialchars( $req->query->get("r_update") );
    $r_delete= htmlspecialchars( $req->query->get("r_delete") );
    $level= htmlspecialchars( $req->query->get("niveau") );
    $order= htmlspecialchars( $req->query->get("order") );
    
    //return $login.$r_create.$r_update.$r_delete.$level;
    
    $where_and=" WHERE ";
    
    if($login=="") $sql="SELECT * FROM users ";
    else { $sql="SELECT * FROM users WHERE login REGEXP '$login' "; $where_and=" AND "; }

    if($r_create!=-1)   {$sql.=" $where_and r_create=$r_create "; $where_and=" AND ";}
        
    if($r_update!=-1)  { $sql.=" $where_and r_update=$r_update "; $where_and=" AND ";}
    
    if($r_delete!=-1)   {$sql.=" $where_and r_delete=$r_delete ";$where_and=" AND ";}
    
    if($level!=-1)   {$sql.=" $where_and level=$level ";}
    
    $sql.=$order;
    
    try{
        $reponse=$app['db']->fetchAll($sql);
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/administration?erreur=5");
    }
    
    return $app->json($reponse);
    
});







$app->match("/changement_droit",function(Application $app, Request $req){
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=="GET") return $app->redirect('/administration');
    if($app['session']->get('level')!=2) return $app->redirect('/');
    
    $type=htmlspecialchars($req->get('type') );
    $id=htmlspecialchars($req->get('id') );
    $valeur=htmlspecialchars($req->get('valeur') );
    
        //couche d'abstraction entre les attributs html et ceux de la bdd
        if($type=='create')         $type='r_create';
        else if($type=='update')    $type='r_update';
        else if($type=='delete')    $type='r_delete';
        else if($type=='level')     $type='level';
        else return $app->redirect('/administration?erreur=6');
        
        if($type!='level'){
            if($valeur=='true') $valeur=2;
            else $valeur=0;
        }
        
        if($valeur!=2 && $valeur!=1 && $valeur!=0) return $app->redirect('/administration?erreur=7');
        
        try{
            $q=$app['db']->executeUpdate("UPDATE users SET $type=? WHERE id_user=?",array($valeur,$id));
            
        }catch(Doctrine\DBAL\DBALException $e){
           return $app->redirect('/administration?erreur=8');
        }
        
        return $app->abort(200,"Ok");
});




$app->match("/changement_droit_this",function(Application $app, Request $req){
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=="GET") return $app->redirect('/compte');
    if($app['session']->get('level')==null) return $app->redirect('/');
    
    $type=htmlspecialchars( $req->get('type') );
    $id=htmlspecialchars( $req->get('id') );
    $valeur=htmlspecialchars( $req->get('valeur') );
    
        //couche d'abstraction entre les attributs html et ceux de la bdd
        if($type=='create')         $type='r_create';
        else if($type=='update')    $type='r_update';
        else if($type=='delete')    $type='r_delete';
        else return $app->redirect('/compte?erreur=14');
        
        if($valeur!=1 && $valeur!=0) return $app->redirect('/administration?erreur=7');
    
        try{
            $q=$app['db']->executeUpdate("UPDATE users SET $type=? WHERE id_user=?",array($valeur,$id));
            
        }catch(Doctrine\DBAL\DBALException $e){
           return $app->redirect('/compte?erreur=9');
        }
        $app['session']->set($type,$valeur);
        
        return $app->abort(200,"Ok");
});



$app->match("/recup_event",function(Application $app,Request $req){
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=="GET") return $app->redirect('/');
    
    $calendrier=$req->get('calendrier');////
    $date_start=$req->get('date_start');////
    $date_end=$req->get('date_end');////
 
    if($calendrier=="") $sql="SELECT * FROM events WHERE title_calendrier='test' AND date_start BETWEEN '$date_start' AND '$date_end'  ORDER BY date_start DESC";
    else $sql="SELECT * FROM events WHERE title_calendrier='$calendrier'  AND date_start BETWEEN '$date_start' AND '$date_end' ORDER BY date_start ASC";
    
    try{
        $reponse=$app['db']->fetchAll($sql);
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/?erreur=20");
    }
    
    return $app->json($reponse);

});


$app->match("/recup_modif",function(Application $app,Request $req){
    $metode_formulaire=$req->getmethod();
    if($metode_formulaire=="GET") return $app->redirect('/');
    
    $calendrier=$req->get('calendrier');////
 
    $sql="SELECT * FROM modif WHERE title_calendrier='$calendrier' ";
    
    try{
        $reponse=$app['db']->executeQuery($sql)->fetch();
    }catch(Doctrine\DBAL\DBALException $e){
        return $app->redirect("/?erreur=20");
    }
    
    return $reponse['valeur'];

});








$app->match("/signout",function(Application $app,Request $req){
    $app['session']->clear();
    $app['session']->remove('login');
    $app['session']->remove('id');
    $app['session']->remove('r_update');
    $app['session']->remove('r_create');
    $app['session']->remove('r_delete');
    $app['session']->remove('level');
    
    return $app->redirect('/');//$app['twig']->render("signup.html",array() );
    
});








$app->match("/h/{a}",function(Application $app,Request $req,$a){
    return sha1($a);
});


$app->match("/d",function(Application $app,Request $req){
    return  time();
});



// On lance l'application
$app->run();

?>
