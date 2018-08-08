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

    }
  }

  registerUser(username, password){
    axios.post(dbUrl + '/signup', {username: username, password: password})
    .then(function(response) {
        console.log(response);
        return true;
    })
    .catch(function(error)  {
      console.log(error);
      return false;
    })
  }

  loginUser(username, password) {
    axios.post(dbUrl + '/login', {username:username, password:password})
    .then( function (response) {
      console.log(response);
      this.setState({loggedIn: true});
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
    return (
      // <div className="root-container">
      //   {this.state.loggedIn?  <Document/> :
      //     <Login registerUser={this.registerUser}/> }
      // </div>
      <Document/>
    );
  }
}
