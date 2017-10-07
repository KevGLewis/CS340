
var serverAddressOne = serverAddress + '/LOA_Status';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", serverAddressOne);
    });
    
}

// onload="editServer()" 
