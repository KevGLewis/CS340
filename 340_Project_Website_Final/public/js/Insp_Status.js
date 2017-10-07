
var extension = 'Insp_Status';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", extension);
    });
    
}
