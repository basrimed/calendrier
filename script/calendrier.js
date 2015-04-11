var time; //time est initialisé dynamiquement sur la page html
var level; //level est initialisé dynamiquement sur la page html
time=(time*1000); //on formate la date en millisecondes



var date=[];
var calendrier=[];
var semaine=['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi','Dimanche'];
var etat_souris=0;
var valeur_modiication=0;
var pop_select=0;
var modal_o_n=0;
var resultat;

/*
create_table(time); 
recup_event(time);
*/



setInterval(modification_o_n,500);


function modification_o_n(){
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/recup_modif");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onload=function(){ 
        if(valeur_modiication==xhr.response) ;
        else{
            $('.modal').modal('hide');
            if(modal_o_n==1){
                sup_last_action();
                modal_o_n=0;
            }
        valeur_modiication=xhr.response
        create_table(time); 
        recup_event(time);
        }
    }
    xhr.send("calendrier="+title_calendrier);
}





//empeche quelque probleme avec le glisser de la souris
document.onselectstart=function(){
    return false;
}


document.getElementById("semaineSuivante").onclick=function(){
    time+=3600*24*7*1000;   // 1 heurre * 24 = >1 jour * 7 => 1 semaine * 1000 => 1 semaine en millisecondes 
    document.getElementById('time').value=time/1000;
    create_table(time);
    recup_event(time);
}


document.getElementById("semainePrecedente").onclick=function(){
    time-=3600*24*7*1000;   // 1 heurre * 24 => 1 jour * 7 => 1 semaine * 1000 => 1 semaine en millisecondes
    document.getElementById('time').value=time/1000;
    create_table(time);
    recup_event(time);
}


//BootstrapDialog.confirm('Hi Apple, are you sure?');

//Selection d'un nouveau evenement
var y;
var date_debut_evenement;
var date_fin_evenement;
var action=new Array();

document.getElementById("calendrier").onmousedown=function(e){
    var cellule=e.target;
    $(".pop").popover('hide');
    if(modal_o_n==1){
        sup_last_action();
        modal_o_n=0;
    }
    
    if( cellule.className=='pop' || cellule.dataset['clic']=='nan' ) return 0;
    
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
    
    date_debut_evenement=cellule.dataset['date_heurre'];
    date_fin_evenement=cellule.dataset['date_heurre'];
        var x=cellule.dataset['x'];
            y=cellule.dataset['y'];
            calendrier[x][y].className='down';
            action.push(x);
            
            etat_souris=1;
}



document.getElementById("calendrier").onmouseover=function(e){
    if(etat_souris!=1) return 0;

        var cellule=e.target;
        var x=cellule.dataset['x'];
        var j=cellule.dataset['y'];
           
            //l'utilisateur change de Jour      
            if(y!=j){
                sup_last_action();
                BootstrapDialog.alert('Veuillez respecter la continuité de votre Evenement !!');
                return -1;
            }
                
            //l'utilisateur entre en collision avec un autre evenement
            if(cellule.className=='down') { // && etat_souris==1){
                sup_last_action();
                BootstrapDialog.alert('Veuillez ne pas heurter d\'autre Evenement !!');
                return -1;
            }
    
    calendrier[x][y].className='down';
    action.push(x);
    
        if( calendrier[x][y].dataset['date_heurre'] > date_fin_evenement ) date_fin_evenement=calendrier[x][y].dataset['date_heurre'];
        if( calendrier[x][y].dataset['date_heurre'] < date_debut_evenement ) date_debut_evenement=calendrier[x][y].dataset['date_heurre'];
}





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
            
            $('.modal').modal('show');
            modal_o_n=1;
        
}




function change(n_event){
    
            document.getElementById("date_debut_evenement").value=resultat[n_event].date_start;
            document.getElementById("date_fin_evenement").value=resultat[n_event].date_end;
            
            document.getElementById("type").value=1;
            document.getElementById("id_event").value=resultat[n_event].id_event;
            
            document.getElementById("debut_evenement").innerHTML=resultat[n_event].date_start;
            document.getElementById("fin_evenement").innerHTML=resultat[n_event].date_end;
            
            document.getElementById("titre").value=resultat[n_event].title_event;
            document.getElementById("description").value=resultat[n_event].description;
            
            /********************************************************/
                        $('.modal').modal('show');
            modal_o_n=1;
 
}





function sup(n_event){
            document.getElementById("type").value=2;
            document.getElementById("id_event").value=resultat[n_event].id_event;
            document.getElementById("valider").click();
}










function sup_last_action(){
        for(var i in action)   calendrier[ action[i] ] [y].className='';  
        action=new Array();
        etat_souris=0;
        
                //var attribut = document.createAttribute('rowspan');
            //attribut.nodeValue =1 ;
            //calendrier[ min_action() ][y].setAttributeNode(attribut);
        
        
        return true;
}




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








function create_table(time){

    for(var i=0;i<7;i++) date[i]=new Date( this.time+(3600*24*1000*i) );
    
    var table=document.createElement('table');
    
    var tr=document.createElement('tr');
        th=document.createElement('th');
        th.innerHTML='Date/heurre ';
    tr.appendChild(th);
        
    for(var i=0;i<7;i++){
        var th=document.createElement('th');
        th.innerHTML=semaine[i]+'     ';
        
            if(date[i].getDate()<10) th.innerHTML+='0'+date[i].getDate();
            else th.innerHTML+=date[i].getDate();
            
            var mois=date[i].getMonth()+1; //Java script retourne le mois entre 0 et 11, on formate la valeur du mois
            if(mois<10) th.innerHTML+='/0'+mois;
            else th.innerHTML+='/'+mois;
            
            th.innerHTML+='/'+date[i].getFullYear();
            
        tr.appendChild(th);
    }
    table.appendChild(tr);
    
    
var heurre=0;
var minute="";
for(var i=0;i<48;i++){
var heurre_formater;
    tr=document.createElement('tr');
        var td=document.createElement('td');
        
        if(heurre<10) heurre_formater="0"+heurre;
        else  heurre_formater=heurre;
        
        td.innerHTML=heurre_formater;
            if(i%2==0)     minute=':00:00';
            else           minute=':30:00';
            td.innerHTML+=minute;
        
    tr.appendChild(td);
    
    calendrier[i]=[];
    for(var j=0;j<7;j++){
        
        calendrier[i][j]=document.createElement('td') ;//td=document.createElement('td');
            calendrier[i][j].dataset['x']=i;
            calendrier[i][j].dataset['y']=j;
            calendrier[i][j].dataset['date_heurre']=formatage_date(date[j])+" "+heurre_formater+""+minute ;            
                
       tr.appendChild(calendrier[i][j]);
        }
    table.appendChild(tr);
    
    if(i%2!=0) heurre+=1;
}
    document.getElementById("calendrier").innerHTML="";  
    //$('#calendrier').append(table).fadeIn('slow');
    document.getElementById("calendrier").appendChild(table);
}









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






function recup_event(time_debut){
    var date_debut=new Date(time_debut);
    var date_fin=new Date(time_debut + (3600 * 24 * 7 * 1000 ) );
    var modification_en_cour=0;
    
    
    var xhr=new XMLHttpRequest();
    xhr.open("POST","/recup_event");
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

                    if(calendrier[j][i].dataset['date_heurre'] == resultat[k].date_start && modification_en_cour!=1 ) {
                                  
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
                                        
                                        
                                        
                                        
                                        
                                    $(".pop").popover({html:true});
                                    //$("#pop"+resultat[k].id_event).popover({html:true});
                                    
                                calendrier[j][i].innerHTML+="<br><b>createur:</b> "+resultat[k].creator+" <br><b>Titre: </b>"+resultat[k].title_event+" <br> <b>Description: </b>"+resultat[k].description;

                                
                                modification_en_cour=1;
                                j_debut=j;
                                i_debut=i;
                    }
                    else if( modification_en_cour==1 ){
                        calendrier[j][i].parentNode.removeChild(calendrier[j][i]);
                        //calendrier[j][i].className="down";
                    }
                    
                    if(calendrier[j][i].dataset['date_heurre'] == resultat[k].date_end && modification_en_cour==1 ) {
                        
                  
                              var attribut = document.createAttribute('rowspan');
                                attribut.nodeValue = j - j_debut +1 ;
                                calendrier[j_debut][i_debut].setAttributeNode(attribut);
                
                                modification_en_cour=0;
                                k++;
                    }
            }
        }
        //$(".pop").popover();/**********************/
    };
    
    xhr.send("calendrier="+title_calendrier+"&date_start="+formatage_date(date_debut)+" 00:00:00&date_end="+formatage_date(date_fin)+" 00:00:00");
}




