//var host = 'http://localhost:3000';
var host = 'https://agora-chat-server.herokuapp.com';

//var geolocation_stub = { lat:45.787059, long: 3.113755 };
var geolocation_stub = null;

function update_rooms(lat, long){
    $('#location_button').html("Fetching rooms !"); 
    $.ajax({
        url: host+"/rooms/lat/"+lat+"/long/"+long
    }).done(function( data ) {
        $("#rooms").html("");


        data.rooms.forEach(function(room){
            var o = new Option(room.display_name, room.code);
            $(o).html(room.display_name);
            $("#rooms").append(o);
        });
        $('#location_button').html("Rooms found !"); 
        $('#username_group').removeClass('hide');
        $('#room_group').removeClass('hide');
        $('#send').removeClass('disabled');
        $('#rooms').val(data.rooms[0].code);
    }).fail(function(){
         $('#location_button').html("Location error..."); 
    });
}
        
$('#send').click(function(){
    window.location = "chat.html?room="+$('#rooms').val()+"&username="+$('#username').val();
    console.log("lol");
});
        
$('#location_button').click(function(){
    $('#location_button').html("Fetching location...");
    if ("geolocation" in navigator) {
        if(!geolocation_stub) {
            navigator.geolocation.getCurrentPosition(function(position) {
                update_rooms(position.coords.latitude, position.coords.longitude);
            });
            var watchID =  navigator.geolocation.watchPosition(function(position) {
            update_rooms(position.coords.latitude, position.coords.longitude);
                navigator.geolocation.clearWatch(watchID);
            });
        } else {
            update_rooms(geolocation_stub.lat, geolocation_stub.long);
        }
    } else {
        alert("Geolocation not available");
    }
});