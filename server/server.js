const path      = require('path');
const http      = require('http');
const express   = require('express');
const socketIO  = require('socket.io');

const {generateMessage} = require('./utils/message.js');
const publicPath    = path.join(__dirname, '../public');
const port          = process.env.PORT || 3000;

//console.log(__dirname + '/../public');
//console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('NEW USER CONNECTED');

    // Csak a csatlakozott usernek küldi
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

    // A csatlakozott useren kivül mindenkinek elküldi
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('createMessage', message);
        // IO.emit mindenkinek elküldi az üzenetet
        io.emit('newMessage', generateMessage(message.from, message.text));

        // Event acknowledgment
        callback('This is from the server');

        // Broadcast mindenkinek elküldi kivéve aki küldte
        //socket.broadcast.emit('createMessage', {
        //        from: message.from,
        //        text: message.text,
        //        createdAt: new Date().getTime()
        //});
    });

    socket.on('disconnect', () => {
        console.log('USER DISCONNECTED');
    });
});

server.listen(port, () => {
    console.log('Started on port ' + port);
});