CREATE TABLE users(
id_user int PRIMARY KEY AUTO_INCREMENT,
login char(20) UNIQUE NOT NULL,
password char(100),
lastco TIMESTAMP,
level int NOT NULL DEFAULT 0,
r_update int NOT NULL DEFAULT 0,
r_create int NOT NULL DEFAULT 0,
r_delete int NOT NULL DEFAULT 0

);



CREATE TABLE events(
id_event int PRIMARY KEY AUTO_INCREMENT,
title_calendrier char(20),
title_event char(20),
date_start datetime NOT NULL,
date_end datetime NOT NULL,
description varchar(256),
creator int REFERENCES users(id_user)

);


CREATE TABLE modif(
title_calendrier char(20) REFERENCES events(title_calendrier) PRIMARY KEY,
valeur int DEFAULT 0

);




                      <!--  <table class="col-sm-12" > 
                            <tr>
                                <th>Login</th>
                                <th>niveau</th>
                                <th>creation</th>
                                <th>modification</th>
                                <th>suppression</th>
                            </tr>
                            
                            
                            
  
                            {% for var in reponse %}
                            <tr>
                            <td> {{ var['login'] }} </td>
                            
                            <td>                             
                                <select data-level-id="{{ var['id_user'] }}">
                                <option value="2" 
                                {% if var['level']==2 %} 
                                selected
                                {% endif%}
                                > Administateur
                                </option>
                                
                                <option value="1" 
                                {% if var['level']==1 %} 
                                selected
                                {% endif%}
                                >Normal</option>
                                
                                <option value="0" 
                                {% if var['level']==0 %} 
                                selected
                                {% endif%}
                                >Restreint</option>
                            </select> 
                            </td>
                            
                            <td>                             
                                <input type="checkbox" data-create-id="{{ var['id_user'] }}"
                                {% if var['r_create']==1 %} 
                                checked
                                {% elseif var['r_create']==2 %}
                                {% endif%}
                                /> 
                            </td>
                            
                            <td>                             
                                <input type="checkbox" data-update-id="{{ var['id_user'] }}"
                                {% if var['r_update']==1 %} 
                                checked
                                {% elseif var['r_update']==2 %}
                                {% endif%}
                                /> 
                            </td>
                            
                            <td>                             
                                <input type="checkbox" data-delete-id="{{ var['id_user'] }}"
                                {% if var['r_delete']==1 %} 
                                checked
                                {% elseif var['r_delete']==2 %}
                                {% endif%}
                                /> 
                            </td>
                            
                            </tr>
                            {% endfor %}
                            
                            
                            

                            

                            
                        </table>
                        --!>
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
          <div class="row">
            <div class="col-sm-6">Mot de Passe :</div>  
            <div class="col-sm-6"> <input type="password" name="password1"/> </div> 
          </div>
          
          <div class="row">
            <div class="col-sm-6">retapez Mot de Passe :</div>  
            <div class="col-sm-6"> <input type="password" name="password2"/> </div> 
          </div>
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
          
              /*
        tr=document.createElement('tr');
            th=document.createElement('th');
            th.innerHTML='Date/heurre ';
        tr.appendChild(th);
    
    
            th=document.createElement('th');
            th.innerHTML='Lundi ';
                if(date[0].getDate()<10) th.innerHTML+='0'+date[0].getDate();
                else th.innerHTML+='0'+date[0].getDate();
            +date[0].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            
            th=document.createElement('th');
            th.innerHTML='Mardi '+date[1].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            th=document.createElement('th');
            th.innerHTML='Mercredi '+date[2].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            th=document.createElement('th');
            th.innerHTML='Jeudi '+date[3].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            th=document.createElement('th');
            th.innerHTML='Vendredi '+date[4].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            th=document.createElement('th');
            th.innerHTML='samedi '+date[5].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
            th=document.createElement('th');
            th.innerHTML='dimanche '+date[6].getDate()+'/'+date[0].getMonth()+'/'+date[0].getYear();
        tr.appendChild(th);
        
        
        
    table.appendChild(tr);*/
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
/*date[j].getFullYear()+"-";

                        mois=date[j].getMonth()+1;  //Java script retourne le mois entre 0 et 11, on formate la valeur du mois
                        
                        if(mois<10) calendrier[i][j].dataset['date_heurre']+='0'+mois;
                        else calendrier[i][j].dataset['date_heurre']+=mois;
                        
                        if(date[j].getDate()<10) calendrier[i][j].dataset['date_heurre']+='-0'+date[j].getDate();
                        else calendrier[i][j].dataset['date_heurre']+='-'+date[j].getDate();
                        
                        calendrier[i][j].dataset['date_heurre']+=" "+heurre_formater+""+minute  ;*/