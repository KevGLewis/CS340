var extension = 'LOA_Status';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", extension);
    });
    
} 
