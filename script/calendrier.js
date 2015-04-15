var time; //time est initialisé dynamiquement sur la page html
var level; //level est initialisé dynamiquement sur la page html
time=(time*1000); //on formate la date en millisecondes


var date=[];
var calendrier=[];
var semaine=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
var etat_souris=0;
var valeur_modification=0;
var pop_select=0;
var modal_o_n=0;
var resultat;
var evenement_proche=-1;
var last_alert=-1;

/*
create_table(time); 
recup_event(time);

var date_heure_actuel= new Date();
date_heure_actuel= formatage_date( date_heure_actuel )+" "+formatage_heure( date_heure_actuel  ) ;
*/

modification_o_n();




//Fonction qui interroge la BDD pour voir s'il y a eu des modifications sur un calendrier
//si oui, on charge les eveenements de la semaine visité par l'utilisateur.
//si l'utilisateur fait appel à un calendrier qui n'existe pas on lui propose de créer le calendrier

function modification_o_n(){
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/calendrier/recup_modif");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload=function(){ 
        
        if(xhr.response==-1) BootstrapDialog.confirm("Ce calendrier n'existe pas, voulez-vous le creer?",function(results){
                                                        if(results){
                                                            var xhr_add=new XMLHttpRequest();
                                                            xhr_add.open("POST","/calendrier/add_calendrier");
                                                            xhr_add.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                            xhr_add.send("calendrier="+title_calendrier);
                                                            setInterval(modification_o_n,500);
                                                        }
                                                        else document.location.href="/defaut"; 
                                                    });
        else if(valeur_modification==xhr.response) ;
        else{
            $('.modal').modal('hide');
            if(modal_o_n==1){
                sup_last_action();
                modal_o_n=0;
            }
            
        valeur_modification=xhr.response
        create_table(time); 
        recup_event(time);
        setInterval(modification_o_n,500);
        }
    }
    xhr.send("calendrier="+title_calendrier);
}





//empeche quelque probleme avec le glisser de la souris
document.onselectstart=function(){
    return false;
}


//Fonction pour faire avancer le calendrier d'une semaine, on charge les événements de la nouvelle semaine sélectionnée
document.getElementById("semaineSuivante").onclick=function(){
    time+=3600*24*7*1000;   // 1 heure * 24 = >1 jour * 7 => 1 semaine * 1000 => 1 semaine en millisecondes 
    document.getElementById('time').value=time/1000;
    create_table(time);
    recup_event(time);
}


//Fonction pour faire reculer le calendrier d'une semaine, on charge les événements de la nouvelle semaine sélectionnée
document.getElementById("semainePrecedente").onclick=function(){
    time-=3600*24*7*1000;   // 1 heure * 24 => 1 jour * 7 => 1 semaine * 1000 => 1 semaine en millisecondes
    document.getElementById('time').value=time/1000;
    create_table(time);
    recup_event(time);
}


//Fonction pour chaner la semaine (la semaine est choisie via une liste de date), on charge les événements de la nouvelle semaine sélectionnée
document.getElementById("choix_semaine").onchange=function(){
    time=parseInt (document.getElementById("choix_semaine").options[document.getElementById('choix_semaine').selectedIndex].value );  // 1 heure * 24 => 1 jour * 7 => 1 semaine * 1000 => 1 semaine en millisecondes
    document.getElementById('time').value=time/1000;
    create_table(time);
    recup_event(time);
}





//Selection d'un nouveau evenement
var y;
var date_debut_evenement;
var date_fin_evenement;

//On stocke les derniere action d'un utilisateur, pour pouvoir les annuler.
var action=new Array();

document.getElementById("calendrier").onmousedown=function(e){
    if (e.which==3) return 0; //on élimine les actions faite par un bouton droit de la souris.
    var cellule=e.target;
    
    //on annule les dernieres action dans le cas ou un utilisateur a commencer a créé un evenement alors qu'il n'a pas valider/annuler  
    //un dernier evenement qu'il a commencer a créé.
    $(".pop").popover('hide');
    if(modal_o_n==1){
        sup_last_action();
        modal_o_n=0;
    }
    
    //si l'utilisateur click sur un evenement deja créé, on fait rien on sort
    if( cellule.className=='pop' || cellule.dataset['clic']=='nan' ) return 0;
    
    
    //gestion des droits qu'a un utilisateur sur un calendrier
    //il y a d'autres vérifications côté serveur, si jamais l'utilisateur manipule du JS
    if( level!="0" && level!="1" && level!="2"  ) {
        BootstrapDialog.alert('Veuillez vous connectez pour pouvoir interagire avec le calendrier !!');
        return -1;
    }
    if(level=="0") {
        BootstrapDialog.alert('Votre compte n\'a pas encore eté certifié!!');
        return -1;
    }
    if(r_create!=2) {
        BootstrapDialog.alert('Vous n\'avez pas le droit d\'ajouter un evenement!!');
        return -1;
    }
    
    
    action=new Array();
    if(cellule.className=='down'){
            BootstrapDialog.alert('Veuillez ne pas heurter d\'autre Evenement !!');
            return -1;
        }
    
    //si tous est bon pour ce bouton gauche, on commence a selectioner un nouveau evenement
    //On stocke les informations utile pour la suite
    //On passe de l'etat "neutre" a "en train de selectioner un nouveau evenement"
    date_debut_evenement=cellule.dataset['date_heure'];
    date_fin_evenement=cellule.dataset['date_heure'];
        var x=cellule.dataset['x'];
            y=cellule.dataset['y'];
            calendrier[x][y].className='down';
            action.push(x);
            etat_souris=1;
}



//si on est dans l'etat "en train de selectioner un nouveau evenement", 
//l'action de cette fonction veut dire que l'utilisateur alonge la durré de l"evenement 
document.getElementById("calendrier").onmouseover=function(e){
    if(etat_souris!=1) return 0;

        var cellule=e.target;
        var x=cellule.dataset['x'];
        var j=cellule.dataset['y'];
           
            //l'utilisateur change de jour(basculement d'une colonne vers une autre), on annule la sélection
            if(y!=j){
                sup_last_action();
                BootstrapDialog.alert('Veuillez respecter la continuité de votre Evenement !!');
                return -1;
            }
                
            //l'utilisateur entre en collision avec un autre evenement, on annule la selection 
            if(cellule.className=='down') { // && etat_souris==1){
                sup_last_action();
                BootstrapDialog.alert('Veuillez ne pas heurter d\'autre Evenement !!');
                return -1;
            }
    calendrier[x][y].className='down';
    action.push(x);
        if( calendrier[x][y].dataset['date_heure'] > date_fin_evenement ) date_fin_evenement=calendrier[x][y].dataset['date_heure'];
        if( calendrier[x][y].dataset['date_heure'] < date_debut_evenement ) date_debut_evenement=calendrier[x][y].dataset['date_heure'];
}




//si on est dans l'etat "en train de selectioner un nouveau evenement", 
// et que le bouton de la souris est relaché => l'utilisateur a créer un evenement, 
//il ne lui reste plus qu'à remplir les informations lié à cet événement.
//l'utilisateur a toujours la possibilité d'annuler cet événement.
document.querySelector("body").onmouseup=function(e){
            if(etat_souris==0) return -1;
            etat_souris=0;
            document.getElementById("date_debut_evenement").value=date_debut_evenement;
            document.getElementById("date_fin_evenement").value=date_fin_evenement;
            
            document.getElementById("type").value=0;
            
            document.getElementById("debut_evenement").innerHTML=date_debut_evenement;
            document.getElementById("fin_evenement").innerHTML=date_fin_evenement;
            
            document.getElementById("titre").value="";
            document.getElementById("description").value="";
            
            date_debut_evenement="";
            date_fin_evenement="";
            
            //On ouvre une interface pour que l'utilisateur puisse saisir les informations de l'événement qu'il vient de créer
            $('.modal').modal('show');
            modal_o_n=1;
        
}





//Fonction utilisé pour pouvoir modifier un evenement.
//Qui peut modifier un evenement? => un admin, le propriétaire de l'evenement, des utilisateurs à qui on a donné
//le droit de modifier des événements qui ne leur appartiennent pas.
function change(n_event){
            document.getElementById("date_debut_evenement").value=resultat[n_event].date_start;
            document.getElementById("date_fin_evenement").value=resultat[n_event].date_end;
            
            document.getElementById("type").value=1;
            
            document.getElementById("creator").value=resultat[n_event].creator;
            document.getElementById("id_event").value=resultat[n_event].id_event;
            
            document.getElementById("debut_evenement").innerHTML=resultat[n_event].date_start;
            document.getElementById("fin_evenement").innerHTML=resultat[n_event].date_end;
            
            document.getElementById("titre").value=resultat[n_event].title_event;
            document.getElementById("description").value=resultat[n_event].description;
            
            $('.modal').modal('show');
            modal_o_n=1;
 
}




//meme chose que la fonction chane() mais cette fois c'est pour la suppression
function sup(n_event){
    BootstrapDialog.confirm("confirmer la suppression de l\'evenement",function(confirmation){
        if(confirmation){
            document.getElementById("type").value=2;
            document.getElementById("id_event").value=resultat[n_event].id_event;
            document.getElementById("creator").value=resultat[n_event].creator;
            document.getElementById("valider").click();        
        }
    });
}









//Fonction qui supprime les dernières actions d'un utilisateur
function sup_last_action(){
        for(var i in action)   calendrier[ action[i] ] [y].className='';  
        action=new Array();
        etat_souris=0;
        return true;
}






//Un utilisateur peut commencer à sélection un événement soit en partant par l'as ou par le haut
//on doit don récupérer la date min et Max de l'ensemble des cases selectioner par l'utilisateur
function max_action(){
    var max=-1;
    for(var i in action){
        if( max<action[i] ) max=action[i];
    }
    return max;
}


function min_action(){
    var min=49;
    for(var i in action){
        if( min>action[i] ) min=action[i];
    }
    return min;
}






function create_select(time){
    var select=document.getElementById('choix_semaine');
    select.innerHTML="";
    for(var i = -4 ; i<=4 ; i++){
        var option=document.createElement('option');
            option.value= time + (i *7 * 24 * 3600 * 1000);
            option.innerHTML=formatage_date_inverse(   time + (i *7 * 24 * 3600 * 1000)  ) ;
                if(i==0){
                    var attribut = document.createAttribute('selected');
                    option.setAttributeNode(attribut);
                }
        select.appendChild(option);
    }
}







function create_table(time){
    create_select(time);

    for(var i=0;i<7;i++) date[i]=new Date( this.time+(3600*24*1000*i) );
    
    var table=document.createElement('table');
    
    var tr=document.createElement('tr');
        th=document.createElement('th');
        th.innerHTML='Date/heure ';
    tr.appendChild(th);
        
    for(var i=0;i<7;i++){
        var th=document.createElement('th');
        th.innerHTML=semaine[i]+'     '+formatage_date_inverse( date[i] );
            
        tr.appendChild(th);
    }
    table.appendChild(tr);
    
    
var heure=0;
var minute="";
for(var i=0;i<48;i++){
var heure_formater;
    tr=document.createElement('tr');
        var td=document.createElement('td');
        
        if(heure<10) heure_formater="0"+heure;
        else  heure_formater=heure;
        
        td.innerHTML=heure_formater;
            if(i%2==0)     minute=':00:00';
            else           minute=':30:00';
            td.innerHTML+=minute;
        
    tr.appendChild(td);
    
    calendrier[i]=[];
    for(var j=0;j<7;j++){
        
        calendrier[i][j]=document.createElement('td') ;//td=document.createElement('td');
            calendrier[i][j].dataset['x']=i;
            calendrier[i][j].dataset['y']=j;
            calendrier[i][j].dataset['date_heure']=formatage_date(date[j])+" "+heure_formater+""+minute ;            
                
       tr.appendChild(calendrier[i][j]);
        }
        
    table.appendChild(tr);
    if(i%2!=0) heure+=1;
    }
    
document.getElementById("calendrier").innerHTML="";  
document.getElementById("calendrier").appendChild(table);
}




 
function recup_event(time_debut){
    var date_debut=new Date(time_debut);
    var date_fin=new Date(time_debut + (3600 * 24 * 7 * 1000 ) );
    var modification_en_cour=0;
    
    
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/calendrier/recup_event");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onload=function(){
        resultat=JSON.parse(xhr.responseText) ;
        var nb_resultat=resultat.length ;
        var k=0;
        var j_debut;
        var i_debut;

        for( var i=0 ; i<7 ; i++ ){
            for ( var j = 0; j < 48; j++ ) {
                if(k==nb_resultat) return 1;

                    if(calendrier[j][i].dataset['date_heure'] == resultat[k].date_start && modification_en_cour!=1 ) {
                        if(  (new Date()  <  new Date(resultat[k].date_start)) && getCookie('last_alert')==resultat[k].id_event ) evenement_proche=0;
                        if(  (new Date()  <  new Date(resultat[k].date_start)) && getCookie('last_alert')!=resultat[k].id_event && evenement_proche!=0){
                        evenement_proche =   new Date(resultat[k].date_start) - new Date()   ;
                        
                        evenement_proche-=30 * 60 * 1000 ;
                        if (evenement_proche<0) evenement_proche=0;
                        
                        setTimeout(function(){
                            BootstrapDialog.alert("Un Evenement se deroule dans moins de 15 minute !!" );
                        },evenement_proche);
                        evenement_proche=0;

                        
                            document.cookie="last_alert="+resultat[k].id_event;
                             //alert(getCookie('last_alert'));
                        }
                                  
                                calendrier[j][i].className="down";       //rel
                                calendrier[j][i].innerHTML=" <a class=\"pop\"  rel='popover' id='pop"+resultat[k].id_event+"'  data-original-title=' <h4 class=\"pop\">"+resultat[k].creator+" -- "+resultat[k].title_event+"</h4>' data-content='<p class=\"pop\">"+resultat[k].description+"</p>'> <span data-clic='nan' class='glyphicon glyphicon-eye-open'></span> </a>" ;
                                    
                                if(level>0){
                                    
                                    if( resultat[k].creator == login || level==2 || r_update==2 ){       
                                            calendrier[j][i].innerHTML+="<a  onclick='change("+k+")' >  <div data-clic='nan' class='glyphicon glyphicon-wrench' >   </div> </a>"
                                        }
                                        
                                    if( resultat[k].creator == login || level==2 || r_delete==2 ){       
                                            calendrier[j][i].innerHTML+="<a  onclick='sup("+k+")' >  <div data-clic='nan' class='glyphicon glyphicon-remove' >   </div> </a>"
                                        }
                                }
                                        
                                    //$(".pop").popover({html:true});
                                    //$("#pop"+resultat[k].id_event).popover({html:true});
                                    setTimeout( function(){  $(".pop").popover({html:true});    },2*1000);
                                    
                                calendrier[j][i].innerHTML+="<br><b>createur:</b> "+resultat[k].creator+" <br><b>Titre: </b>"+resultat[k].title_event+" <br> <b>Description: </b>"+resultat[k].description;

                                
                                modification_en_cour=1;
                                j_debut=j;
                                i_debut=i;
                    }
                    else if( modification_en_cour==1 ){
                        calendrier[j][i].parentNode.removeChild(calendrier[j][i]);
                        //calendrier[j][i].className="down";
                    }
                    
                    if(calendrier[j][i].dataset['date_heure'] == resultat[k].date_end && modification_en_cour==1 ) {
                        
                              var attribut = document.createAttribute('rowspan');
                                attribut.nodeValue = j - j_debut +1 ;
                                calendrier[j_debut][i_debut].setAttributeNode(attribut);
                
                                modification_en_cour=0;
                                k++;
                    }
            }
        }
    };
    xhr.send("calendrier="+title_calendrier+"&date_start="+formatage_date(date_debut)+" 00:00:00&date_end="+formatage_date(date_fin)+" 00:00:00");
}











//retourne une date sous format DD/MM/YYYY
function formatage_date_inverse(date_non_formater){
    date_non_formater=new Date( date_non_formater );
    var date_formater;
            if(date_non_formater.getDate()<10) date_formater='0'+date_non_formater.getDate();
            else date_formater=date_non_formater.getDate();
            
            var mois=date_non_formater.getMonth()+1; //Java script retourne le mois entre 0 et 11, on formate la valeur du mois
            if(mois<10) date_formater+='/0'+mois;
            else date_formater+='/'+mois;
            
            date_formater+='/'+date_non_formater.getFullYear();
            return date_formater;
}





//retourne une date sous format YYYY-MM-DD
function formatage_date(date_non_formater){
    date_non_formater=new Date( date_non_formater );
    var date_formater;
    
            date_formater=date_non_formater.getFullYear()+"-";

                        var mois=date_non_formater.getMonth()+1;  //Java script retourne le mois entre 0 et 11, on formate la valeur du mois
                        
                        if(mois<10) date_formater+='0'+mois;
                        else date_formater+=mois;
                        
                        if(date_non_formater.getDate()<10) date_formater+='-0'+date_non_formater.getDate();
                        else date_formater+='-'+date_non_formater.getDate();
            return date_formater;
}




//retourne une heurre sous format HH:MM:SS
function formatage_heure(heure_non_formater){
    heure_non_formater=new Date( heure_non_formater );
    var heure_formater;
    
            if( heure_non_formater.getHours()<10 ) heure_formater="0"+heure_non_formater.getHours()+":";
            else  heure_formater=heure_non_formater.getHours()+":";
            
            if( heure_non_formater.getMinutes()<10 ) heure_formater+="0"+heure_non_formater.getMinutes()+":";
            else  heure_formater+=heure_non_formater.getMinutes()+":";
            
            if( heure_non_formater.getSeconds()<10 ) heure_formater+="0"+heure_non_formater.getSeconds();
            else  heure_formater+=heure_non_formater.getSeconds();

            return heure_formater;
}



//pour lire un cookie
function getCookie(sName) {
        var oRegex = new RegExp("(?:; )?" + sName + "=([^;]*);?");
        if (oRegex.test(document.cookie)) {
                return decodeURIComponent(RegExp["$1"]);
        } else {
                return null;
        }
}
