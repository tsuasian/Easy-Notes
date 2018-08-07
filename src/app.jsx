import React from 'react';
import Login from './components/login/login'
import Document from './components/textEditor/document';
import io from 'socket.io-client';
import axios from 'axios';
const dbUrl = 'http://localhost:1337';

export default class App extends React.Component {
  //class constructor
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
    };
    // this.onToggleLoggedIn = this.onToggleLoggedIn.bind(this);
    this.loginUser = this.loginUser.bind(this)
  }

  registerUser(username, password, cb){
    axios.post(dbUrl + '/signup', {username: username, password: password})
    .then(function(response) {
        console.log("(success) response register", response);
        cb(response);
    })
    .catch(function(error)  {
      console.log("(error registering)", error);
      cb(null);
    })
  }

  loginUser(username, password) {
    axios.post(dbUrl + '/login', {username:username, password:password})
    .then((response) => {
      console.log("response login", response);
      // this.onToggleLoggedIn();
      // loggedIn: !this.state.loggedIn

      this.setState(prevState => ({
      loggedIn: !prevState.loggedIn
    }));

      console.log("logged in?", this.state.loggedIn);
    })
    .catch(err => {
      console.log(err);
    })
  }



  componentDidMount() {
    console.log('COMPONENTDIDMOUNT');
    var socket = io('http://localhost:1337')
   //  socket.on('connect', function()  {
   //    console.log('ws connect')
   //  });
   // socket.on('disconnect', function() {
   //    console.log('ws disconnect')
   //  });
   //  socket.on('msg', message => {
   //    console.log(message);
   //  })
  }

  render() {
    return (<div className="root-container">
      {this.state.loggedIn?  <Document/> :
          <Login registerUser={this.registerUser} loginUser={this.loginUser}/> }
    </div>);
  }
}
