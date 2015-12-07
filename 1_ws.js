//---------------------------------------------------------------
// The purpose is to introduce you to websockets
// This is a SERVER that is SEPARATE from the http server.
//
// Your webpage (in this case the index.html in this directory)
// will be SERVED by the http server. THEN, it will connect to the 
// websocket server. Then - they will talk to each other!
//
// Note that in regular http - the server cannot initiate a conversation
// Here, the websocket server sends a message to the client browser.
//
// This example has THREE parts
// 1) The http server code (which is same as what we did earlier)
// 2) This code - this is the web socket server
// It prints what it got from client. It also sends a message to the
// client after every 1 second.
// 3) The html or client code. Note how it connects to the websocket
// and how it sends and receives messages
//
// To RUN THIS EXAMPLE
// First, run node httpServer.js on one terminal
// Next, run node 1_ws.js on another terminal
// Next, type localhost:4000/index.html on some browser
//
//---------------------------------------------------------------
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

var io = require('socket.io').listen(5000);

var users = [];

var messages = [];

io.sockets.on('connection', function(socket) {
	var username;
	socket.on('JOIN', function(content) {
		if(users.contains(content))
		{
			socket.emit('nameInUse', content);
			return;
		}
		username = content;
		users.push(content);
		io.sockets.emit('WHO', users);
		socket.emit('allMessages', messages);
	});
	socket.on('disconnect', function(content)
	{
		if(users.contains(username))
		{
			var index = users.indexOf(username);
			if(index > -1)
			{
				users.splice(index, 1);
			}
		}
		//I know, it is terribly inefficient to send all users all the time. Oh well.
		socket.emit('WHO', users);
	});
	socket.on('PRIVMSG', function(content){
		messages.push(content);
		console.log(messages);
		io.sockets.emit('PRIVMSG', content);
	});
});
