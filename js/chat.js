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
      
var query = getQueryParams(document.location.search);
$('#chat_header').html('Room: '+query.room);
var socket = io(host);

$('#send_message').click(function(){
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
    $('#message-list').append($('<li>').append($('<p>').text("User joined: "+msg.username)));
});