var $=document.querySelector.bind(document);
var r_create=-1;
var r_update=-1;
var r_delete=-1;
var order="";
var header=["Login <a data-order='logup' onclick='ordre(this)' class='glyphicon glyphicon-arrow-up'></a>"+ 
            "<a data-order='logdown' onclick='ordre(this)' class='glyphicon glyphicon-arrow-down'></a>",
            'level','create','update','delete',
            "Date de creation <a data-order='dateup' onclick='ordre(this)' class='order glyphicon glyphicon-arrow-up'></a>"+
            "<a data-order='datedown' onclick='ordre(this)' class=' order glyphicon glyphicon-arrow-down'></a> "];
            

window.onload=liste;

$("#recherche").onchange=liste;




$("#r_create").onclick=function(e){
    if(r_create==-1){
        r_create=0;
        $("#r_create").className="btn btn-success btn-sm";
    }
    else if(r_create==0){
        r_create=1;
        $("#r_create").className="btn btn-warning btn-sm";
    }
    else if(r_create==1){
        r_create=2;
        $("#r_create").className="btn btn-danger btn-sm";
    }
    else{
        r_create=-1;
        $("#r_create").className="btn btn-default btn-sm";
    }
    liste();
    return true;
}



$("#r_update").onclick=function(e){
    if(r_update==-1){
        r_update=0;
        $("#r_update").className="btn btn-success btn-sm";
    }
    else if(r_update==0){
        r_update=1;
        $("#r_update").className="btn btn-warning btn-sm";
    }
    else if(r_update==1){
        r_update=2;
        $("#r_update").className="btn btn-danger btn-sm";
    }
    else{
        r_update=-1;
        $("#r_update").className="btn btn-default btn-sm";
    }
    liste();
    return true;
}




$("#r_delete").onclick=function(e){
    if(r_delete==-1){
        r_delete=0;
        $("#r_delete").className="btn btn-success btn-sm";
    }
    else if(r_delete==0){
        r_delete=1;
        $("#r_delete").className="btn btn-warning btn-sm";
    }
    else if(r_delete==1){
        r_delete=2;
        $("#r_delete").className="btn btn-danger btn-sm";
    }
    else{
        r_delete=-1;
        $("#r_delete").className="btn btn-default btn-sm";
    }
    liste();
    return true;
}



$("#niveau").onchange=function(){
    liste();
    return true;
}


$("#reboot").onclick=function(e){
 r_create=-1;
 r_update=-1;
 r_delete=-1;
 $("#r_create").className="btn btn-default btn-sm";
 $("#r_update").className="btn btn-default btn-sm";
 $("#r_delete").className="btn btn-default btn-sm";
 $("#niveau").options[0].selected=true;
 $("#recherche").value="";
 liste();
 return true;
}


$("#lance_recherche").onclick=function () {
    liste();
    return true;
}





//Cree une liste d'utilisateurs enregistrés, selon les options de recherche
function liste(){
    var col;
    var select;
    var option;
    var checkbox;
    var span;
    var sup;
    var xhr=new XMLHttpRequest();
    xhr.open("GET","/calendrier/recherche_utilisateur?r="+$("#recherche").value+"&r_create="+r_create+"&r_update="+r_update+"&r_delete="+r_delete+"&niveau="+$('#niveau').value+"&order="+order,true);
    xhr.responseType = 'json';
    xhr.onload=function(event){
        var resultat=xhr.response;

        var table=document.createElement('table');
        var lig=document.createElement('tr');
            
            for(var i=0 ; i<6 ;i++){
                col=document.createElement('th');
                col.innerHTML=header[i];
                lig.appendChild(col);
            }   
            table.appendChild(lig);
            
            
            if(resultat.length==0){
                lig=document.createElement('tr');
                    col=document.createElement('td');
                    col.setAttribute('colspan','6');
                    col.innerHTML="Pas de resultat";
                lig.appendChild(col);
                table.appendChild(lig);
            }

            
        for(var temp in resultat){
            
            lig=document.createElement('tr');
            
            col=document.createElement('td');
                sup=document.createElement('a');
                sup.className='deleteuser glyphicon glyphicon-remove-circle';
                sup.setAttribute('data-sup_id',resultat[temp].id_user);
                sup.setAttribute('onclick','supuser(this)');
                 

            col.appendChild(sup);
            col.innerHTML+=resultat[temp].login;
            
            lig.appendChild(col);
            
            col=document.createElement('td');
            
            select=document.createElement('select');
            select.className='level';

                select.setAttribute('data-level_id',resultat[temp].id_user);
                select.setAttribute('onchange','changement_droit(this)');
                
                
                option=document.createElement('option');
                option.innerHTML='Admin';
                if(resultat[temp].level==2)     option.setAttribute('selected','');

                option.value="2";
                select.appendChild(option);
                
                option=document.createElement('option');
                option.innerHTML='Normal';
                if(resultat[temp].level==1)  option.setAttribute('selected','');

                option.value="1";
                select.appendChild(option);
                
                option=document.createElement('option');
                option.innerHTML='Restreint';
                if(resultat[temp].level==0)   option.setAttribute('selected','');
                option.value="0";
                select.appendChild(option);
                
            col.appendChild(select);
            lig.appendChild(col);
            
            col=document.createElement('td');
                checkbox=document.createElement('input');
                checkbox.className='create';
                checkbox.type='checkbox';
                checkbox.setAttribute('data-create_id',resultat[temp].id_user);
                checkbox.setAttribute('onchange','changement_droit(this)');
                
                if(resultat[temp].r_create==2)   checkbox.setAttribute('checked','');
                
                if(resultat[temp].r_create==1){
                    span=document.createElement('span');
                    span.className='rond';
                    span.appendChild(checkbox);
                    col.appendChild(span);
                }
                else col.appendChild(checkbox);
            lig.appendChild(col);
            
            
            col=document.createElement('td');
                checkbox=document.createElement('input');
                checkbox.className='update';
                /**///checkbox.innerHTML='*';
                checkbox.type='checkbox';
                checkbox.setAttribute('data-update_id',resultat[temp].id_user);
                checkbox.setAttribute('onchange','changement_droit(this)');
                
                if(resultat[temp].r_update==2)  checkbox.setAttribute('checked','');
                
                if(resultat[temp].r_update==1){
                    span=document.createElement('span');
                    span.className='rond';
                    span.appendChild(checkbox);
                    col.appendChild(span);
                    }
                else col.appendChild(checkbox);
            lig.appendChild(col);
            
            
            col=document.createElement('td');
                checkbox=document.createElement('input');
                checkbox.className='delete';
                checkbox.type='checkbox';
                checkbox.setAttribute('data-delete_id',resultat[temp].id_user);
                checkbox.setAttribute('onchange','changement_droit(this)');
                
                if(resultat[temp].r_delete==2)    checkbox.setAttribute('checked','');
                
                if(resultat[temp].r_delete==1){
                    span=document.createElement('span');
                    span.className='rond';
                    span.appendChild(checkbox);
                    col.appendChild(span);
                }
                else col.appendChild(checkbox);
            lig.appendChild(col);
            
            col=document.createElement('td');
            col.innerHTML=resultat[temp].date_create;
            lig.appendChild(col);
            
        table.appendChild(lig);
        }
        table.className="col-sm-12";
    $('#tableau').innerHTML="";
    $('#tableau').appendChild(table);
    }
    xhr.send(null);
};






//L'administrateur décide de changer un droit sur un utilisateur
function changement_droit(e){
    var classe=e.className;
    var xhr= new XMLHttpRequest();
    xhr.open("POST","/calendrier/changement_droit");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    if(classe=='create')        xhr.send("type="+classe+"&id="+e.dataset['create_id']+"&valeur="+e.checked);

    else if(classe=='update')   xhr.send("type="+classe+"&id="+e.dataset['update_id']+"&valeur="+e.checked);
        
    else if (classe=='delete')  xhr.send("type="+classe+"&id="+e.dataset['delete_id']+"&valeur="+e.checked);
        
    else if (classe=='level')   xhr.send("type="+classe+"&id="+e.dataset['level_id']+"&valeur="+e.value);
        
    else return false;
    
    return true;
    
}



//Gestion des fleches qui font le trie du resultat
function ordre(e){
    order=e.dataset.order;
    liste();
    return 1;
}






function supuser(e){
     BootstrapDialog.confirm("veuillez confirmer la suppression de l'utilisateur",function(results){
                                                        if(results){
                                                                var id_user=e.dataset['sup_id'];
                                                                var xhr=new XMLHttpRequest();
                                                                xhr.open("POST","/calendrier/sup_user")
                                                                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
                                                                xhr.onload=function(){
                                                                 if(xhr.response==1){
                                                                     liste();
                                                                     }
                                                                }
                                                                xhr.send("id_user="+id_user);
                                                        }
                                                    });

    
}


