var sys = require("sys"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    io = require('socket.io');

var pidfile = fs.openSync("/var/tmp/node-occupy.pid", "w");
fs.writeSync(pidfile, process.pid + "");
fs.closeSync(pidfile);

var nlog = require(__dirname + '/lib/logging');

function log(message) {
  nlog.updateAccessLog(message);
}

server = http.createServer(function(req, res){ 
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.write('<h1>occupy.troisen.com</h1>'); 
  res.end(); 
});

var socket = io.listen(server);

socket.on('connection', function(client) {
  log("<"+client.sessionId+"> connected");
  client.send('Occupy offline');

  /*
  var timeout = setInterval(function() {
    log("<"+client.sessionId+"> sending ping");
    client.send(new Date().getTime());
  }, 1000);
  */

  client.on('message', function(evt) {
    log("<"+client.sessionId+"> " + JSON.stringify(evt));
  })

  client.on('disconnect', function() {
    log("closed connection: " + client.sessionId);
    /*clearTimeout(timeout);*/
    client.broadcast('bye');
  }) 
});

server.listen(1978, "178.79.178.146");
