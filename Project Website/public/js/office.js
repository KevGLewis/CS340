
var serverAddressOne = serverAddress + '/office';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", serverAddressOne);
    });
    
}

function validateForm(event){
    
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("name").value);
    dataIn.push(document.getElementById("zipcode").value);
    
    
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
  
        req.open('GET', serverAddress + '?addItem=true&office_name='+ dataIn[0] + '&zipcode=' + dataIn[1], true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                window.location.reload();

          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
    
}




