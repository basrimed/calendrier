$.urlParam = function(name){
    var results = new RegExp('[\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
}
 
// example.com?param1=name&amp;param2=&amp;id=6
var erreur=$.urlParam('erreur'); // name

alert(erreur);


switch (erreur) {
    case 1:
        // code
        break;
        
    case 2:
        // code
        break;
        
    case 3:
        // code
        break;
        
    case 4:
        // code
        break;
        
    case 5:
        // code
        break;
        
    case 6:
        // code
        break;
        
    case 7:
        // code
        break;
        
    case 8:
        // code
        break;
        
    case 9:
        // code
        break;
        
    case 10:
        // code
        break;
        
    case 11:
        // code
        break;
        
    case 12:
        // code
        break;
        
    case 13:
        // code
        break;
        
    case 14:
        // code
        break;
        
    case 15:
        // code
        break;
        
    case 16:
        // code
        break;
        
    case 17:
        // code
        break;
        
    case 18:
        // code
        break;
        
    case 19:
        // code
        break;
        
    case 20:
        // code
        break;
    
    default:
        // code
}