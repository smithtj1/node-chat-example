var socket;

function addMessage(msg, nickname) {
   $("#chatEntries").append('<div class="message"><p>' + new Date().toLocaleString() 
                                                       + ' ' + nickname 
                                                       + ' : ' + msg 
                                                       + '</p></div>');
}

function sentMessage() {
   if ($('#messageInput').val() != ""){
      socket.emit('message', $('#messageInput').val());
      $('#messageInput').val('');
   }
}

function setNickname() {
   if ($("#nicknameInput").val() != ""){
      
      initializeSocket();

      socket.emit('setNickname', $("#nicknameInput").val());
      $('#chatControls').show();
      $('#chatEntries').show();
     
      $('#nicknameControls').hide();
      $('#nickname').text($("#nicknameInput").val());
   }
}

function initializeSocket(){
   if(!socket){
         socket = io.connect('http://localhost');
         socketHook();
      }
}

function socketHook(){
   //socket actions
   socket.on('message', function(data) {
      addMessage(data['message'], data['nickname']);
   });   
}

$(function() {
   //wait for nickname before showing chat controls
   $("#chatControls").hide();
   $('#chatEntries').hide();

   //add event listeners
   $("#nicknameSet").click(function() {setNickname()});
   $("#submit").click(function() {sentMessage();});
});