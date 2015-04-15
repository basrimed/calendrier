var b_create=document.getElementById('b_create')
var b_update=document.getElementById('b_update')
var b_delete=document.getElementById('b_delete')
var r_create=document.getElementById('r_create')
var r_update=document.getElementById('r_update')
var r_delete=document.getElementById('r_delete')

$("#changemdp").popover({
    html: 'true',
placement: 'right'
});    
    
    
//Un utilisateur peut envoyer une demande pour acquérir un nouveau droit
var xhr=new XMLHttpRequest();
var valeur;
    b_create.onchange=function(){
      xhr.open("POST","/calendrier/changement_droit_this");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(b_create.checked) valeur=1;
        else valeur=0;
              xhr.onload=function(){
                if( valeur==1 ) r_create.className='rond';
                else r_create.className='';
              };
              xhr.send("type=create&id="+this.dataset['create_id']+"&valeur="+valeur)  ;
    };
    
    
      b_update.onchange=function(){
      xhr.open("POST","/calendrier/changement_droit_this");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(b_update.checked) valeur=1;
        else valeur=0;
              xhr.onload=function(){
                if( valeur==1 ) r_update.className='rond';
                else r_update.className='';
              };
      xhr.send("type=update&id="+this.dataset['update_id']+"&valeur="+valeur)  ;
    };
    
    
    
      b_delete.onchange=function(){
      xhr.open("POST","/calendrier/changement_droit_this");
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        if(b_delete.checked) valeur=1;
        else valeur=0;
              xhr.onload=function(){
                if( valeur==1 ) r_delete.className='rond';
                else r_delete.className='';
              };
      xhr.send("type=delete&id="+this.dataset['delete_id']+"&valeur="+valeur)  ;
    };