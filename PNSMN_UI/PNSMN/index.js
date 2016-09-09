/*var express = require('express');
var app = express();
var os = require('os');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var url = require('url') ;

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res){
  var queryObject = url.parse(req.url,true).query;
  /*Displaying the parameter and its value on the terminal*/
 /* console.log(queryObject);

  /*Updating html display file*/
 /* res.sendFile(__dirname +'/index.html');
});


io.on('connection', function(socket) {
   // console.log(getClientAddress);
    var ose = os.platform();
    console.log(os.platform());
     socket.emit('message', {'message': 'hello world'});
});


http.listen(5001, function(){
  console.log('listening on *:3001');
});*/

var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var app = require('express');


var server = http.createServer(function(request, response){
    var path = url.parse(request.url).pathname;
    switch(path){
        case '/':
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write('hello');
            response.end();
            break;
        case '/index.html':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        default:
            response.writeHead(404);
            response.write("opps this doesn't exist - 404");
            response.end();
            break;
    }
});

server.listen(5001);

var listener = io.listen(server);

listener.sockets.on('connection', function(socket){

    var tmstp = socket.handshake.time;
    var ref = socket.handshake.headers.referer;
    var os = require('os');

    socket.on('client_connected',function(ip){
        socket.broadcast.emit('display_client',{'time':tmstp,'ref':ref,'os':os.platform(),'ip':ip.ip});
        console.log('Got connection from: '+ip.ip);
    });

    socket.on('client_alert',function(ip){
        socket.broadcast.emit('alert_client',"hello");
    });

    socket.on('disconnect', function() {
      console.log('Got disconnect!');
    });
});