var host = 'http://localhost:3000';
//var host = 'https://agora-chat-server.herokuapp.com';

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}

var people = 1;
      
var query = getQueryParams(document.location.search);
$('#chat_header').html('Room: '+query.room);
var socket = io(host);

$('#send_message').click(function(){
    $('#message-list').append($('<li>').append($('<p>').text(query.username+": "+$('#user_message').val())));
    socket.emit('chat message', {username: query.username, room: query.room, msg:$('#user_message').val()});
    $('#user_message').val('');
    return false;
});

socket.on('chat message', function(msg){
    $('#message-list').append($('<li>').append($('<p>').text(msg.username+": "+msg.msg)));
});
        
socket.on('setup', function(msg){
    socket.emit('setup', {room: query.room, username: query.username});
});
        
socket.on('user joined', function(msg){
    people++;
    $('#chat_header').html('Room: '+query.room+' ('+people+' people)');
    //$('#message-list').append($('<li>').append($('<p>').text("User joined: "+msg.username)));
});

socket.on('user left', function(msg){
    people--;
    $('#chat_header').html('Room: '+query.room+' ('+people+' people)');
    //$('#message-list').append($('<li>').append($('<p>').text("User joined: "+msg.username)));
});


socket.on('room update', function(data){
    people = data.users;
    $('#chat_header').html('Room: '+query.room+' ('+people+' people)');
    console.log(data);
});