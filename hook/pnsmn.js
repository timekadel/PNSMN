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

  include('http://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
      $(document).ready(function() {
          $.getScript('http://192.168.0.103:5001/socket.io/socket.io.js', function() {
            var socket = io("http://192.168.0.103:5001");
            socket.emit('client_connected',{"ip":result});
            socket.on('alert_client',function(data){
                alert("hola buenos dias!");
            });
          });
      });
  });
});

