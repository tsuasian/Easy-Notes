import http from 'http';
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const assert = require('assert');

import cookieParser from 'cookie-parser';
import session from 'express-session'
import passport from 'passport';
import LocalStrategy from 'passport-local';
// import logger from 'morgan'
import MongoStoreLib from 'connect-mongo';
var MongoStore = MongoStoreLib(session);
import User from './models/user'

import apiRouter from './routes/api.js'



//sockets
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);

app.use('/', apiRouter);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//TODO: look over for repeats..
console.log("mongo uri", process.env.MONGODB_URI);

//  ********************* ****  //
// ***  MONGODB CONNECTION ***  //
//  **************************  //
if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
//
import authRouter from './routes/auth.js'
// const dbRoutes = require('./routes/auth.js');



mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});

mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});

// //create server, listen on port 1337
// http.createServer((req, res) => {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello World\n');
// }).listen(1337, '127.0.0.1');
//
// console.log('Server running at http://127.0.0.1:1337/');


//  ***************************  //
// ***  SOCKET IO ROUTES    ***  //
//  ***************************  //
server.listen(1337, ()=> {
  console.log('Server for React Todo App listening on port 1337!')
});

io.on('connection', function(socket)  {
  console.log('connected to socket');
  socket.emit('msg', {hello: 'world'});
  socket.on('cmd', function(data) {
    console.log(data);
  });
  socket.on('sayHi', (data) => {
    console.log("in socket");
    console.log(data.hi);
  })

  //CREATE DOC
  socket.on('createDoc', ({user, name}) => {
    User.findById(user._id).then(user => {
      var newDocument = new Document({
        owner: user._id,
        collaborator: [],
        name
      });

      newDocument.save();
      user.documents.push(newDocument);
      user.save();
      socket.emit('documentCreated', newDocument)
    });
  })
});



//  ***************************  //
// ***  PASSPORT ROUTES     ***  //
//  ***************************  //

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done){
  console.log('LOCAL STRAT', username, password);
  User.findOne({ username })
  .then(function(user){
    if (!user){
      console.log('1');
      done(null, false);
    } else if (user.password !== password){
      console.log('2');
      done(null, false);
    } else {
      console.log('user from passport', user);
      done(null, user);
    }
  })
  .catch(function(error){
    done(error);
  })
}))

passport.serializeUser((user, done) => {
  console.log('SERIALIZE');
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    console.log("user from deserialize", user);
    done(err, user);
  });
});

app.use('/', authRouter(passport));


app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

// module.exports = app;
export default app;
