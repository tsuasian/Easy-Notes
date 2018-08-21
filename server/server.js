import http from 'http';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import passport from 'passport';
import LocalStrategy from 'passport-local';
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
import authRouter from './routes/auth.js'
const assert = require('assert');
const app = express();
const server= require('http').Server(app);
const io = require('socket.io')(server);

//  initialize app
app.use('/', apiRouter);
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*
    SERVER SIDE LOGIC FOR COLLAB-TEXT PROJECT
      -MONGO DB CONNECTION
      -SOCKET IO EVENT HANDLING

    - "document" is the MongoDB Schema which contains collaborating users,
      title, and an owner.
    - "documentContents" is the MongoDB Schema which contains a link to the
      document it refers to, and an EditorState maintained by the npm package
      draft.js. This is the text, and formatting of each document.
*/


//    **  MONGO DB CONNECTION AND SETUP   **    //
console.log("mongo uri", process.env.MONGODB_URI);

//if no env
if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}

// if env not setup/sourced
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}

//connect to database
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});


//    ** SOCKET IO EVENTS   **    //
//listen on port
server.listen(1337, ()=> {
  console.log('Server for Collab-Text listening on port 1337!')
});

//socket EVENTS
io.on('connection', function(socket)  {
  //log status
  console.log('connected to socket');


  //  CREATE DOC -> create new document and new documentContents (text) model
  socket.on('createDoc', ({user, name}) => {

    //find current user on database
    //create new document
    User.findById(user._id).then(user => {
        var newDocument = new Document({
        owner: user._id,
        collaborator: [],
        name
      });

      //create new document contents (blank)
      var newDocumentContents = new DocumentContent({
        documentId: newDocument._id,
        editorState: null
      })

      //save document and document contents
      newDocument.save();
      newDocumentContents.save();

      //link document to user
      //save (modified) user
      user.documents.push (newDocument);
      user.save();

      //emit reply with newly created document and document contents
      socket.emit('documentCreated', newDocument, newDocumentContents);
    });
  })


  //  LOAD DOC -> load all the documents a user is collaborating on
  socket.on('loadDocuments', (user) => {
    //initialize array of document objects
    let arr = [];

    //iterate over the documentIds in collaborating documents
    for (var document in user.documents){

      //search the database by the documentId to find
      //the document object
      Document.findById(user.documents[document])

      //once a document is found, push it on to the array of
      //document objects
      .then(doc => {
        arr.push(doc)
        //emit reply with newly updated array
        socket.emit('documentsLoaded', arr)
      })
    }
  })


  //LOAD DOCUMENT CONTENTS -> load a specific document's contents
  //create socket io room for document
  socket.on('loadDocumentContents', ({documentId}) => {

    //grab documentContent object from mongoDB
    DocumentContent.findOne({documentId:documentId})
      //once found
      .then( (docContent) => {
        //emit reply with found documentContent
        socket.emit('documentContentsLoaded', docContent);
    })

    // create socketRoom based on documentId
    // convert mongoSchema_id object to a string
    let roomName = String(documentId);
    socket.join(roomName);
  })


  //ON DOCUMENT EDIT -> relay changed state to other sockets in room
  socket.on('docChange' , ({editorState, roomName}) => {
    //given the updated editorState and the roomName (documentId)
    //reply back to all other sockets in room
    socket.broadcast.to(roomName).emit('newEditorState', editorState);
  })

  //ON SELECTION STATE EDIT -> emit cursor highlights
  // TODO: implement with frontend.
  socket.on('selectChange' , ({selectionState, roomName}) =>{
    // console.log("roomName from docChange", roomName);
    // console.log("editorsstate", editorState);
    // console.log('type of editorstate', typeof(editorState));
    //reply back to all other sockets in room
    socket.broadcast.to(roomName).emit('newEditorState', editorState);
  })



  //SAVE DOCUMENT -> save document to mongoDB for persistence
  socket.on('saveDocumentContents', ({documentId, editorState}) => {

    //find documentContent given documentId
    DocumentContent.findOne({documentId:documentId})

    .then( (docContent) => {
      //update editorState and save docContent
      docContent.editorState = editorState
      docContent.save()
    })
    //handle errors
    .catch(error => {
      console.log('error from saveDocumentContents listener', error);
    })
  })


  //SHARE DOCUMENT -> pass in a username to share document
  socket.on('inviteUser', ({documentId, username}) => {

    //find user object given unique username
    User.findOne({username})

    .then( (addedUser) => {

      //check if already shared, if so, ignore
      //add document to "collaborating" attribute of the user
        if (addedUser.documents.indexOf(documentId) == -1) {
          addedUser.documents.push(documentId);
          addedUser.save()
        }

      //catch errors
      }).catch(() => {
      console.log("user not found in invite user socket")
    })

    //now, add user to document's "collaborators" attribute
    //find document by documentId
    Document.findById(documentId)

    .then( (document) => {
      //push username onto document's array
      document.collaborators.push(username);
      console.log("document's collaborators", document.collaborators);
    })

    //catch errors
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
