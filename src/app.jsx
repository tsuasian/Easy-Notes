import React from 'react';
import Login from './components/login/login'
import Register from './components/login/register'
import LogReg from './components/login/logreg'
import Document from './components/textEditor/document';
import DocPortal from './components/docPortal';
import io from 'socket.io-client';
import axios from 'axios';
const dbUrl = 'http://localhost:1337';
// process.env.NGROK_URL;

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      socket:  io(dbUrl),
      docSummary: null,
      docContent: null,
      // usernameExists: false,
    };
    this.loginUser = this.loginUser.bind(this)
  }

  registerUser = (username, password, next) => {
    axios.post(dbUrl + '/signup', {username: username, password: password})
    .then(function(response) {
      if (typeof response.data == "string"){
        console.log('In app.js: Throwing error: ', response.data)
        next(response.data);
      } else{
        console.log("(success) response register", response);
        next(null, response);
      }
    })
    .catch( (error) => {
      console.log("error in register request (in app.jsx)", error);
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

  logout = () => {
    console.log('in app.js logout')
    axios.get(dbUrl+'/logout')
    .then(
      this.setState({
        loggedIn: false,
      })
    )
  }

  setSummary(docSummary){
    console.log('in setSummary in app.jsx, docSummary: ', docSummary)
    this.setState({
      docSummary: docSummary,
    })
  }

  setContents(docContent){
    console.log('in setContents in app.jsx, docContent: ', docContent)
    this.setState({
      docContent: docContent,
    })
  }

  setDocChosenToNull(){
    //will now evalute to false, will go back
    console.log('in set chosen to null');
    this.setState({
      docContent: null,
      docSummary: null,
    });
  }

  render() {
    return (
      this.state.loggedIn
      ? (this.state.docSummary && this.state.docContent)
        ? <Document
            setNull={this.setDocChosenToNull.bind(this)}
            docSummary={this.state.docSummary}
            docContent={this.state.docContent}
            socket={this.state.socket} io={io}
          />
        : <DocPortal
            socket={this.state.socket}
            setSummary={this.setSummary.bind(this)}
            setContents={this.setContents.bind(this)}
            logout={this.logout}
          />
      : <LogReg
          registerUser={this.registerUser}
          loginUser={this.loginUser}
        />
    );
  }
}
