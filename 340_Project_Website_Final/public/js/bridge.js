var extension = 'bridge';


function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", extension);
    });
    
}

function validateForm(event){
    
    //var tableIn = document.getElementById('gymList');
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("nbi_id").value);
    dataIn.push(document.getElementById("type").value);
    dataIn.push(document.getElementById("length").value);
    dataIn.push(document.getElementById("spans").value);
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
    

        req = new XMLHttpRequest();
        req.open('GET', serverAddress + "/" + extension + '?addItem=true&nbi_id='+ dataIn[0] + '&type=' + dataIn[1] + '&length=' + dataIn[2] + '&spans=' + dataIn[3] + '&zipcode=' + dataIn[4], true);
        //req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                window.location.reload();
          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
        
    
}
