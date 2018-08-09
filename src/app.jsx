import React from 'react';
import Login from './components/login/login'
import Register from './components/login/register'
import LogReg from './components/login/logreg'
import Document from './components/textEditor/document';
import DocPortal from './components/docPortal';
import io from 'socket.io-client';
import axios from 'axios';
const dbUrl = 'http://localhost:1337';

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      socket:  io('http://localhost:1337'),
      docChosen: null,
    };
    this.loginUser = this.loginUser.bind(this)
  }

////****************************************************
////****************************************************
////****************************************************
  //  TODO: INVALID REGISTRATION FOR NON-UNIQUE USERNAMES
  //  TODO: Handle invalid login credentials
////****************************************************
////****************************************************
////****************************************************

  registerUser(username, password){  //got rid of cb here... what was it for? @sean
    axios.post(dbUrl + '/signup', {username: username, password: password})
    .then(function(response) {
        console.log("(success) response register", response);
        // cb(response);
    })
    .catch(function(error)  {
      console.log("(error registering)", error);
      // cb(null);
    })
  }

  loginUser(username, password) {
    axios.post(dbUrl + '/login', {username:username, password:password})
    .then((response) => {
      console.log("response login", response);
      this.setState(prevState => ({
      loggedIn: !prevState.loggedIn
    }));
      console.log("logged in?", this.state.loggedIn);
    })
    .catch(err => {
      console.log(err);
    })
  }

  render() {
    return (
      this.state.loggedIn
      ? <DocPortal/>
      : <LogReg registerUser={this.registerUser} loginUser={this.loginUser}/>
    );
  }
}
