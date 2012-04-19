var sys = require("sys"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    io = require('socket.io');

var pidfile = fs.openSync("/var/tmp/node-occupy.pid", "w");
fs.writeSync(pidfile, process.pid + "");
fs.closeSync(pidfile);

var nlog = require(__dirname + '/lib/logging');

server = http.createServer(function(req, res){ 
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.write('<h1>occupy.troisen.com</h1>'); 
  res.end(); 
});

// From http://www.internetworldstats.com/stats.htm
var connected_users = 0;
var worlds_population = 6930055154;
var internet_users = 2267233742;

var socket = io.listen(server);

socket.on('connection', function(client) {
  connected_users++;
  client.send(occupy_offline(false));
  client.broadcast(occupy_offline(false));
  log("<"+client.sessionId+"> connected");

  client.on('message', function(evt) {
    log("<"+client.sessionId+"> " + JSON.stringify(evt));
  })

  client.on('disconnect', function() {
    connected_users--;
    client.send(occupy_offline(true)); // update the offline user
    client.broadcast(occupy_offline(false)); // update all the other users with the new total
    log("closed connection: " + client.sessionId);
  }) 
});

function log(message) {
  nlog.updateAccessLog(message);
}

function occupy_offline(offline) {
  var slogan = "There are " + format_number(internet_users + connected_users) + " people with access to the internet."
  slogan += "<br/><br/>";
  slogan += "<b>You are the " + (offline ? disconnected_percent() : connected_percent()) + "%</b>";

  return slogan;
}

function disconnected_percent() {
  return Math.round(100 - ((internet_users + connected_users) / worlds_population) * 100);
}

function connected_percent() {
  return Math.round(((internet_users + connected_users) / worlds_population) * 100);
}

function format_number(number) {
  number += '';
  x = number.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}
server.listen(1978, "178.79.178.146");
