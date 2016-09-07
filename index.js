var http = require("http");
var url = require('url');
var fs = require('fs');
var io = require('socket.io');
var app = require('express');
var express = require('express');

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
        case '/hook/pnsmn.js':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "text/javascript"});
                    response.write(data, "utf8");
                    response.end();
                }
            });
            break;
        case '/node.png':
            fs.readFile(__dirname + path, function(error, data){
                if (error){
                    response.writeHead(404);
                    response.write("opps this doesn't exist - 404");
                    response.end();
                }
                else{
                    response.writeHead(200, {"Content-Type": "image/png"});
                    response.write(data, "binary");
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
        socket.broadcast.emit('display_client',{'time':tmstp,'ref':ref,'os':os.hostname(),'ip':ip.ip,'id':socket.id});
        console.log('Got connection from: '+ip.ip);
    });

    socket.on('disconnect', function() {
      console.log('Got disconnect!');
      socket.broadcast.emit('hide_client',{'id':socket.id});
    });
});