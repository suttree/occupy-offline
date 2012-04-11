 var socket = new io.Socket('occupy.troisen.com', {
  port: 1978,
  reconnect: true,
  reconnectionDelay: 500,
  rememberTransport: false,
  maxReconnectionAttempts: 50,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket'],
});

// From http://www.internetworldstats.com/stats.htm
var worlds_population = 6930055154;
var internet_users = 2267233742;

// Occupy offline
// There are $internet_users people with access to the internet, you are one of them
// There are $internet_users people without access to the internet, you are now one of them

/*

http://flavorwire.com/269261/what-comes-after-the-hipster-we-ask-the-experts?all=1

" The best bet for the next thing would be for something to emerge from the Occupy movement: less concerned about music and clothing, more concerned about politics; less concerned about differentiating yourself from the people around you, more concerned about working with them; less concerned about status, more concerned about social change; less ironic, more earnest"

I'm sick of being jaded. I'm apolitical but I'd rather push things in a politically engaded direction than an ironic one. Whatever the mainstream realisation of the Occupy movement turns out to be, I want it to happen.
*/

socket.on('connect', function() {
  internet_users++;

  /*$('body').css("background-image", "url(/images/bg/connected.jpg)");*/
  $('#status').html(connected_icon());
  $('#occupy').html(occupy_offline(false));
});

socket.on('connect_failed', function () {
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  window.location.href = '/';
  $('#status').html(disconnected_icon());
});

socket.on('disconnect', function() {
  internet_users--;
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  /*$('body').css("background-image", "url(/images/bg/disconnected.jpg)");*/
  $('#status').html(disconnected_icon());
  $('#occupy').html(occupy_offline(true));
});

socket.on('reconnect', function(evt) {
  socket.reconnectionDelay = socket.reconnectionDelay / 2;

  /*$('body').css("background-image", "url(/images/bg/connected.jpg)");*/
  $('#status').html(connected_icon());
});

socket.on('reconnecting', function(evt) {
  $('#status').html(reconnecting_icon());
});

socket.on('reconnect_failed', function() {
  window.location.href = '/';
  $('#status').html(disconnected_icon());
});

socket.on('message', function(evt) {
  /*$('#log').html(evt);*/
});

socket.on('error', function() {
  log("eep");
});

function log(message) {
  console.log(message);
  $('#log').html(message + "&nbsp;" + ajax_loader_icon());
}

function block_move(event) {
  event.preventDefault(); // Tell Safari not to move the window.
}

window.onload = function() {
  socket.connect();
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

function occupy_offline(offline) {
  return "There are " + format_number(internet_users) + " people with access to the internet. You are " + (offline ? 'not one' : 'one') + " of them..."
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
