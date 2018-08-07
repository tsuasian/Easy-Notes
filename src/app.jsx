import React from 'react';
import Login from './components/login/login'
import Document from './components/textEditor/document';
import io from 'socket.io-client';

export default class App extends React.Component {
  //class constructor
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      socket: io('http://localhost:8080')
    }
  }

  componentDidMount() {
    console.log('COMPONENTDIDMOUNT');
    this.state.socket.on('connect', function()  {
      console.log('ws connect')
    });
    this.state.socket.on('disconnect', function() {
      console.log('ws disconnect')
    });
    this.state.socket.on('msg', message => {
      console.log(message);
    })
  }

  render() {
    return (<div className="root-container">
      <Document/>
      {/* <Login/> */}
    </div>);
  }
}
