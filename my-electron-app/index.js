
var server_port = 65432;
var server_addr = "10.0.0.159"
function client() {

    const net = require('net');
    var input = document.getElementById("myName").value;
    
    const client = net.createConnection({ port: server_port, host: server_addr}, () => {
        console.log("Connected to server!");
        client.write(`${input}\r\n`);

    })

    client.on('data', (data) => {
        //alert(data);
        document.getElementById("greet_from_server").innerHTML = data;
        console.log(data.toString());
        client.end();
        client.destroy();
    });

    client.on("end", () => {
        console.log("disconnected from server");
    });

}

function greeting() {
    var name = document.getElementById("myName").value;
    document.getElementById("greet").innerHTML = "Hello " + name + " !";
    //to_server(name);
    client();
}