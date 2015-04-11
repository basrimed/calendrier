var $=document.querySelector.bind(document);
var r_create=-1;
var r_update=-1;
var r_delete=-1;

window.onload=liste();

$("#recherche").onchange=liste;


function liste(){
    var temp;
    var lig;
    var col;
    var select;
    var option;
    var attribut;
    var checkbox;
    var span;
    var xhr=new XMLHttpRequest();
    xhr.open("GET","/recherche_utilisateur?r="+$("#recherche").value+"&r_create="+r_create+"&r_update="+r_update+"&r_delete="+r_delete+"&niveau="+$('#niveau').value,true);
    xhr.responseType = 'json';
    xhr.onload=function(event){
        var resultat=xhr.response;
        
        var table=document.createElement('table');
            lig=document.createElement('tr');
                col=document.createElement('th');
                col.innerHTML="Login";
                lig.appendChild(col);
                
                col=document.createElement('th');
                col.innerHTML="level";
                lig.appendChild(col);
                
                col=document.createElement('th');
                col.innerHTML="create";
                lig.appendChild(col);
                
                col=document.createElement('th');
                col.innerHTML="update";
                lig.appendChild(col);
                
                col=document.createElement('th');
                col.innerHTML="delete";
                lig.appendChild(col);
            table.appendChild(lig);
            
            
            if(resultat.length==0){
                lig=document.createElement('tr');
                    col=document.createElement('td');
                        attribut = document.createAttribute('colspan');
                        attribut.nodeValue = 5;
                        col.setAttributeNode(attribut);
                    col.innerHTML="Pas de resultat";
                lig.appendChild(col);
                table.appendChild(lig);
            }

            
        for(temp in resultat){
            
            lig=document.createElement('tr');
            
            col=document.createElement('td'); 
            col.innerHTML=resultat[temp].login;
            lig.appendChild(col);
            
            col=document.createElement('td');
            
            select=document.createElement('select');
            select.className='level';
                attribut = document.createAttribute('data-level_id');
                attribut.nodeValue = resultat[temp].id_user;
                select.setAttributeNode(attribut);
                
                attribut = document.createAttribute('onchange');
                attribut.nodeValue = 'changement_droit(this)';
                select.setAttributeNode(attribut);
                
                
                option=document.createElement('option');
                option.innerHTML='Admin';
                    if(resultat[temp].level==2){
                        attribut = document.createAttribute('selected');
                        option.setAttributeNode(attribut);
                    }
                option.value="2";
                select.appendChild(option);
                
                option=document.createElement('option');
                option.innerHTML='Normal';
                    if(resultat[temp].level==1){
                        attribut = document.createAttribute('selected');
                        option.setAttributeNode(attribut);
                    }
                option.value="1";
                select.appendChild(option);
                
                option=document.createElement('option');
                option.innerHTML='Restreint';
                    if(resultat[temp].level==0){
                        attribut = document.createAttribute('selected');
                        option.setAttributeNode(attribut);
                    }
                option.value="0";
                select.appendChild(option);
                
            col.appendChild(select);
            lig.appendChild(col);
            
            col=document.createElement('td');
                checkbox=document.createElement('input');
                checkbox.className='create';
                checkbox.type='checkbox';
                attribut = document.createAttribute('data-create_id');
                attribut.nodeValue = resultat[temp].id_user;
                checkbox.setAttributeNode(attribut);
                
                attribut = document.createAttribute('onchange');
                attribut.nodeValue = 'changement_droit(this)';
                checkbox.setAttributeNode(attribut);
                
                
                    if(resultat[temp].r_create==2){
                        attribut = document.createAttribute('checked');
                        checkbox.setAttributeNode(attribut);
                    }
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
                attribut = document.createAttribute('data-update_id');
                attribut.nodeValue = resultat[temp].id_user;
                checkbox.setAttributeNode(attribut);
                
                attribut = document.createAttribute('onchange');
                attribut.nodeValue = 'changement_droit(this)';
                checkbox.setAttributeNode(attribut);
                
                    if(resultat[temp].r_update==2){
                        attribut = document.createAttribute('checked');
                        checkbox.setAttributeNode(attribut);
                    }
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
                attribut = document.createAttribute('data-delete_id');
                attribut.nodeValue = resultat[temp].id_user;
                checkbox.setAttributeNode(attribut);
                
                attribut = document.createAttribute('onchange');
                attribut.nodeValue = 'changement_droit(this)';
                checkbox.setAttributeNode(attribut);
                        
                    if(resultat[temp].r_delete==2){
                        attribut = document.createAttribute('checked');
                        checkbox.setAttributeNode(attribut);
                    }
                if(resultat[temp].r_delete==1){
                    span=document.createElement('span');
                    span.className='rond';
                    span.appendChild(checkbox);
                    col.appendChild(span);
                }
                else col.appendChild(checkbox);
            lig.appendChild(col);

        table.appendChild(lig);
        }
        table.className="col-sm-12";
    $('#tableau').innerHTML="";
    $('#tableau').appendChild(table);
    }
    xhr.send(null);

    
    
};


function changement_droit(e){
    var classe=e.className;
    var xhr= new XMLHttpRequest();
    xhr.open("POST","/changement_droit");
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    if(classe=='create')        xhr.send("type="+classe+"&id="+e.dataset['create_id']+"&valeur="+e.checked);

    else if(classe=='update')   xhr.send("type="+classe+"&id="+e.dataset['update_id']+"&valeur="+e.checked);
        
    else if (classe=='delete')  xhr.send("type="+classe+"&id="+e.dataset['delete_id']+"&valeur="+e.checked);
        
    else if (classe=='level')   xhr.send("type="+classe+"&id="+e.dataset['level_id']+"&valeur="+e.value);
        
    else ;
    
}









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
}


$("#niveau").onchange=function(){
    liste();
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
}









