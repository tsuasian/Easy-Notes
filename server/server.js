import http from 'http';

import cookieParser from 'cookie-parser';
import session from 'express-session'
import passport from 'passport';
import LocalStrategy from 'passport-local';
// import logger from 'morgan'
import MongoStoreLib from 'connect-mongo';
var MongoStore = MongoStoreLib(session);
import User from './models/user'
import Document from './models/document'
import DocumentContent from './models/documentcontent'
import apiRouter from './routes/api.js'
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const assert = require('assert');

//sockets
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);

//initialize app
app.use('/', apiRouter);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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


//  ***************************  //
// ***  SOCKET IO ROUTES    ***  //
//  ***************************  //

server.listen(1337, ()=> {
  console.log('Server for React Todo App listening on port 1337!')
});

io.on('connection', function(socket)  {
  console.log('connected to socket');
  //on event create doc, create new document and documentContents model
  //and save to mongodb
  socket.on('createDoc', ({user, name}) => {
    console.log('got to createDoc socket on server');
    User.findById(user._id).then(user => {
        //make new document summary
        var newDocument = new Document({
        owner: user._id,
        collaborator: [],
        name
      });
      //make new document contents. editorState is the <Editor/> setState
      //i.e. the actual contents
      var newDocumentContents = new DocumentContent({
        documentId: newDocument._id,
        editorState: null
      })
      newDocument.save();
      newDocumentContents.save();
      console.log("new doc", newDocument);
      user.documents.push (newDocument);
      user.save();
      console.log("new user with pushed document", user.documents);
      socket.emit('documentCreated', newDocument, newDocumentContents);
    });
  })

  //LOAD DOC
  socket.on('loadDocuments', (user) => {
    console.log("load doc user", user);
    let arr = [] //array of document objects
    for (var document in user.documents){
      // console.log("current document in for loop", document)
      Document.findById(user.documents[document])
        .then(doc => {
          // console.log("found doc", doc)
          arr.push(doc)
          console.log("arr of document objects", arr);
          socket.emit('documentsLoaded', arr)
      })
    }
  })

  //LOAD DOCUMENT CONTENTS (FROM MDB)
  socket.on('loadDocumentContents', ({documentId}) => {
    console.log("document id from loadDocumentContents", documentId);
    //grab documentcontents from documentcontent
    DocumentContent.findOne({documentId:documentId})
    .then( (docContent) => {
      console.log('FOUND document contents', docContent);
      socket.emit('documentContentsLoaded', docContent);
    })

    //now, lets create a socket room
    // convert mongoSchema_id object to a string
    let roomName = String(documentId);
    socket.join(roomName);
    console.log('user joined room ', roomName);
  })

  //listen for a change in editor state
  socket.on('docChange' , ({editorState, roomName}) =>{
    console.log("roomName from docChange", roomName);
    console.log("editorsstate", editorState);
    console.log('type of editorstate', typeof(editorState));
    //reply back to all other sockets in room
    socket.broadcast.to(roomName).emit('newEditorState', editorState);

    })

    //listen for a change in selection state
    socket.on('selectChange' , ({selectionState, roomName}) =>{
      console.log("roomName from docChange", roomName);
      console.log("editorsstate", editorState);
      console.log('type of editorstate', typeof(editorState));
      //reply back to all other sockets in room
      socket.broadcast.to(roomName).emit('newEditorState', editorState);

      })


  //now listen for emit message event
  //SAVE DOCUMENT CONTENTS (TO MDB)
  socket.on('saveDocumentContents', ({documentId, editorState}) => {
    console.log('document id from saveDocumentContents', documentId);
    console.log('new editor state from saveDocumentContents', editorState);
    DocumentContent.findOne({documentId:documentId})
    .then( (docContent) => {
      docContent.editorState = editorState
      docContent.save()
    })
    .catch(error => {
      console.log('error from saveDocumentContents listener', error);
    })
  })

  //SHARE DOCUMENT WITH ANOTHER USER
  socket.on('inviteUser', ({documentId, username}) => {
    //add document to user's document array
    console.log("hit socket invite user")
    User.findOne({username})
    .then( (addedUser) => {
      //check if already shared
      if (addedUser.documents.indexOf(documentId) == -1) {
        addedUser.documents.push(documentId);
        addedUser.save()
        console.log("user saved")
      }
    }).catch(() => {
      console.log("user not found in invite user socket")
    })
    //add user to document's collaborators array
    Document.findById(documentId)
    .then( (document) => {
      console.log("documentId", documentId);
      console.log("document found", document);
      console.log("collaborators before push", document.collaborators);
      document.collaborators.push(username);
      console.log("document's collaborators", document.collaborators);
    })
    .catch( (error) => {
      console.log("error docs not found");
    })
  });

  socket.on('removeUser', ({documentId, username}) => {
    //remove document from user's document array
    User.findOne({username})
    .then( (removeuser) => {
      //remove document from user's document list
      let index = removeuser.documents.indexOf(documentId);
      if (index > -1) {
        removeuser.documents.splice(index, 1);
        removeuser.save();
      }
    })
    //remove user from document's collaborators array
    Document.findById(documentId)
    .then( (document) => {
      let index = document.collaborators.indexOf(username);
      if (index > -1) {
        document.collaborators.splice(index, 1);
        document.save();
      }
    })
    .catch( (error) => {
      console.log("error");
    })
  })

  //edit title
  socket.on('editTitle', ({documentId, newTitle}) => {
    Document.findById(documentId)
    .then( (document)  => {
      document.name = newTitle;
      document.save()
      console.log("updated document.name to ", document.name);
    })
    .catch(error => {
      console.log("couldn't find document", error);
    })
  })

  socket.on('test', (selectionState, contentState) => {
    console.log('selectionstate', selectionState);
    console.log('contentState', contentState);
  })




});



//  ***************************  //
// ***  PASSPORT ROUTES     ***  //
//  ***************************    //

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
      done(null, user);
    }
  })
  .catch(function(error){
    done(error);
  })
}))

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
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

export default app;
