
var extension = 'employee';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", extension);
    });
    
}

function validateForm(event){
    
    //var tableIn = document.getElementById('gymList');
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("eid").value);
    dataIn.push(document.getElementById("first_name").value);
    dataIn.push(document.getElementById("last_name").value);
    dataIn.push(document.getElementById("rate").value);
    dataIn.push(document.getElementById("office").value);
    
    
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
  
        req.open('GET', serverAddress + "/" + extension + '?addItem=true&employee_id='+ dataIn[0] + '&first_name=' + dataIn[1] + '&last_name=' + dataIn[2] + '&rate=' + dataIn[3] + '&office=' + dataIn[4], true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                console.log("This Happened");
                window.location.reload();

          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
}

