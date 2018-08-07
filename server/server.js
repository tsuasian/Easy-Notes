import http from 'http';
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const assert = require('assert');
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json())


//sockets
const app               = express();
const server            = require('http').Server(app);
const io                = require('socket.io')(server);


//  ********************* ****  //
// ***  MONGODB CONNECTION ***  //
//  **************************  //
if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(process.env.MONGODB_URI);

//create server, listen on port 1337
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');


//  ***************************  //
// ***  SOCKET IO ROUTES    ***  //
//  ***************************  //
server.listen(8080);
io.on('connection', function(socket)  {
  console.log('connected');
  socket.emit('msg', {hello: 'world'});
  socket.on('cmd', function(data) {
    console.log(data);
  });
});
