 var socket = new io.Socket('occupy.troisen.com', {
  port: 1978,
  reconnect: true,
  reconnectionDelay: 500,
  rememberTransport: false,
  maxReconnectionAttempts: 50,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket'],
});

socket.on('connect', function() {
  $('#log').html(connected_icon());
});

socket.on('connect_failed', function () {
  $('#occupy').html(slogan());
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  window.location.href = '/';
});

socket.on('disconnect', function() {
  $('#occupy').html(slogan());
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  $('#log').html(ajax_loader_icon());
});

socket.on('reconnect', function(evt) {
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  $('#log').html(connected_icon());
});

socket.on('reconnecting', function(evt) {
  $('#occupy').html(slogan());
  $('#log').html(ajax_loader_icon());
});

socket.on('reconnect_failed', function() {
  $('#occupy').html(slogan());
  window.location.href = '/';

  $('#log').html(ajax_loader_icon());
});

socket.on('message', function(evt) {
  $('#occupy').html(evt);
});

socket.on('error', function() {
  $('#occupy').html(slogan());
  log("eep");
});

function log(message) {
  console.log(message);
  $('#log').html(message + "&nbsp;" + ajax_loader_icon());
}

function block_move(event) {
  event.preventDefault(); // Tell Safari not to move the window.
}

function ajax_loader_icon() {
  return "<img src='/images/ajax-loader.gif' height='16' width='16' id='spinner' />"
}

function connected_icon() {
  return "<img src='/images/icons/switch-network.png' height='16' width='16' id='status' />"
}

function reconnecting_icon() {
  return "<img src='/images/icons/switch--arrow.png' height='16' width='16' id='status' />"
}

function disconnected_icon() {
  return "<img src='/images/icons/switch--minus.png' height='16' width='16' id='status' />"
}

function slogan() {
  return "There are 2,267,233,742 people with access to the internet.<br/><br/><b>You are the 77%</b><br/><a href='http://troisen.com/occupy-offline.html'>Huh?</a>"
}

window.onload = function() {
  socket.connect();
} 
