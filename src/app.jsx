import React from 'react';
import Login from './components/login/login'
import Document from './components/textEditor/document';
import DocPortal from './components/docPortal';
import io from 'socket.io-client';
import axios from 'axios';
const dbUrl = 'http://localhost:1337';

export default class App extends React.Component {
  //class constructor
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      socket:  io('http://localhost:1337')
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
    this.state.socket.emit('sayHi', {hi: "hi"})
  }

  render() {
    return (
      <div className="root-container">
        <Document />
      </div>
    );
  }
}
//
// {this.state.loggedIn?  <DocPortal socket={this.state.socket}/> :
//     <Login registerUser={this.registerUser} loginUser={this.loginUser}/> }
