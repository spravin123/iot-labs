document.onkeydown = updateKey;
document.onkeyup = resetKey;

var server_port = 65432;
var server_addr = "10.0.0.159";   // the IP address of your Raspberry PI

function client(){
    
    const net = require('net');
    var input = document.getElementById("message").value;

    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('connected to server!');
        // send the message
        client.write(`${input}\r\n`);
    });
    
    // get the data from the server
    client.on('data', (data) => {
        document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        client.end();
        client.destroy();
    });

    client.on('end', () => {
        console.log('disconnected from server');
    });


}

function send_data(data) {
    const net = require('net');
 
    const client = net.createConnection({ port: server_port, host: server_addr }, () => {
        // 'connect' listener.
        console.log('sending keypress ' + data);
        // send the message
        client.write(data);
    });

    client.on('data', (data) => {
        updateElem(data.toString());
        //document.getElementById("bluetooth").innerHTML = data;
        console.log(data.toString());
        client.end();
        client.destroy();
    });
}

function updateElem(data) {
    const jsonObject = JSON.parse(data);
    //alert(jsonObject);
    document.getElementById("direction").innerHTML = jsonObject.direction;
    document.getElementById("speed").innerHTML = jsonObject.speed;
    document.getElementById("distance").innerHTML = jsonObject.distance;
    document.getElementById("temperature").innerHTML = jsonObject.cpu_temperature;
    
}
// for detecting which key is been pressed w,a,s,d
function updateKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        // up (w)
        document.getElementById("upArrow").style.color = "green";
        send_data("38");
    }
    else if (e.keyCode == '40') {
        // down (s)
        document.getElementById("downArrow").style.color = "green";
        send_data("40");
    }
    else if (e.keyCode == '37') {
        // left (a)
        document.getElementById("leftArrow").style.color = "green";
        send_data("37");
    }
    else if (e.keyCode == '39') {
        // right (d)
        document.getElementById("rightArrow").style.color = "green";
        send_data("39");
    }
}

// reset the key to the start state 
function resetKey(e) {

    e = e || window.event;

    document.getElementById("upArrow").style.color = "grey";
    document.getElementById("downArrow").style.color = "grey";
    document.getElementById("leftArrow").style.color = "grey";
    document.getElementById("rightArrow").style.color = "grey";
}


// update data for every 50ms
function update_data(){
    setInterval(function(){
          send_data('info');
    }, 10000);
}


update_data();