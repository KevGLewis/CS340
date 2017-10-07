
var serverAddressOne = serverAddress + '/inspection';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", serverAddressOne);
    });
    
}

function validateForm(event){
    
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("type").value);
    dataIn.push(document.getElementById("budget").value);
    dataIn.push(document.getElementById("pcomp").value);
    dataIn.push(document.getElementById("bridge").value);
    dataIn.push(document.getElementById("loa").value);
    
    dataIn.forEach(function(e) {
        if(!e){
            dataComplete = false;
        }
    });
    
    if(!dataComplete){
        alert("Fill out all entries");
        return false;
    }
    
    else{
        addItem(dataIn);
        return true;
    }

    event.preventDefault
    
}

function addItem(dataIn){
    
        var req = new XMLHttpRequest();
    
        req.open('GET', serverAddressOne + '?addItem=true&type='+ dataIn[0] + '&budget=' + dataIn[1] + '&pcomp=' + dataIn[2] + '&bridge=' + dataIn[3] + '&loa=' + dataIn[4], true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                window.location.reload();
          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
        
    
}
