
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);



// all environments
app.set('port', process.env.PORT || 9999);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('ABC'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var ADMIN = 'GOD';

io.sockets.on('connection', function(socket){
	
	socket.on('setNickname', function (data) {
   		console.log('setNickname requested with data: '+ data);

		socket.get('nickname', function(error, name){
			console.log("getting nickname");
			
			if(name){
				console.log('name already exists: ' +  name);
				//already has a username
				socket.emit('message', {'message' : 'You already are using: ' + name, 
										nickname: ADMIN});
				return;
			}
			
			console.log('error calling is:' + error);

			//this is good.
			socket.set('nickname', data);

	   		var notice_text = data + ' has joined the chat.'
	   		var notice = {'message' : notice_text, nickname : ADMIN }
	   		socket.broadcast.emit('message', notice);
	   		socket.emit('message', notice);
				

		});
			
	});

	socket.on('message', function (message) {
   		socket.get('nickname', function (error, name) {
	      	if(name){
		      	var data = { 'message' : message, nickname : name };
		      	socket.broadcast.emit('message', data);
		      	socket.emit('message', data);
		      	console.log("user " + name + " send this : " + message);
		      	return;
		      }
		      else{
		      	console.log('no nickname for incoming message: ' +  message);
				//no username for this socket
				socket.emit('message', {'message' : 'You need to assign yourself a nickname first', 
										nickname: ADMIN});
				return;
		      }

   		});
	});

});
