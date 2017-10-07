
var serverAddressOne = serverAddress + '/AssReport';

function editServer(){
     Array.from(document.getElementsByClassName('changeServer')).forEach(function(e) {
        e.setAttribute("action", serverAddressOne);
    });
    
}

function validateForm(event){
    
    //var tableIn = document.getElementById('gymList');
    var dataIn = [];
    var dataComplete = true;
    
    dataIn.push(document.getElementById("employee").value);
    dataIn.push(document.getElementById("report_id").value);
    dataIn.push(document.getElementById("hours").value);
    
    console.log(dataIn);
    
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
    
        req.open('GET', serverAddress + '?addItem=true&employee='+ dataIn[0] + '&report_id=' + dataIn[1] + '&hours=' + dataIn[2], true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load',function(){
            if(req.status >= 200 && req.status < 400){
                if(req.response = 'true')
                    window.location.reload();
                else
                    alert("Unable to update database, please check inputs");
          } else {
            console.log("Error in network request: " + req.statusText);
          }});  
        req.send();
    
}
