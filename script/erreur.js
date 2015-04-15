$.urlParam = function(name){
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
}
 
var erreur=$.urlParam('erreur');


switch (erreur) {
    case "1":
        alert("echec lors de l'authentification login/mot de passe incorrect");
        break;
        
    case "2":
        alert("echec, les mots de passe ne correspondent pas");
        break;
        
    case "3":
        alert("echec, lors de l'insertion en BDD");
        break;
        
    case "4":
        alert("echec, lors du select en BDD");
        break;
        
    case "5":
        alert("echec, valeur du parametre non attendu");
        break;
        
    case "6":
        alert("echec, lors de la mise a jour en BDD");
        break;
    case "7":
        alert("echec, arrete de jouer avec le JS ");
        break;
    
    default:
        alert("echec, erreur non attendu");  
}
window.location.search="";