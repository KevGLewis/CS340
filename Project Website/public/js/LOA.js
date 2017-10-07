
var serverAddressOne = serverAddress + '/loa';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", serverAddressOne);
    });
    
}

function validateForm(event){
    
    //var tableIn = document.getElementById('gymList');
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("number").value);
    
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
  
        req.open('GET', serverAddress + '?addItem=true&loa_numb='+ dataIn[0], true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            console.log(req.status);
            if(req.status >= 200 && req.status < 400){
                console.log("This Happened");
                location.reload();
                //self.location.reload();
                //var response = req.responseText;
                //var dataOut = JSON.parse(response);
                //editTable(dataOut);
                //editTable(response, tableIn);
          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
    
}

