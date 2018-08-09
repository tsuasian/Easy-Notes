import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default class Login extends Component {
  state = {mode: true}

  onChange = (field) => (e) => this.setState({
    [field]: e.target.value
  })
  onToggleMode = () => this.setState({
    mode: !this.state.mode
  })

  onLogin = () => {
    const {username, password} = this.state;
    const {socket, navigate} = this.props;
    this.props.loginUser(this.state.username, this.state.password);

    // socket.emit('login', {username, password}, (res) => {
    //   navigate(DocumentList)
    // })

  }
  //  TODO: INVALID REGISTRATION FOR NON-UNIQUE USERNAMES
  onRegister = () => {
    const {username, password, password2, name} = this.state;
    const {socket, navigate} = this.props;
    console.log("username/pass", this.state.username, this.state.password);
    this.props.registerUser(this.state.username, this.state.password, (response) => {
      //set callback function to retrieve response promise from registerUser in parent class
      if (response.data){
        this.onToggleMode()
        this.setState({
          username: "",
          password: ""
        })
      };
    });
    // TODO: if(password !== password2) return this.setState({validation:'Passwords not the same'})
    // socket.emit('register', {username, password, name}, (res) => {
    //   navigate(DocumentList)
    // })
  }

  render() {
    if(this.state.mode) {
      return (
      <div className="box-container">
      <div className="inner-container">
        <div className="header">
          Login
        </div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <TextField
              onChange={this.onChange('username')}
              value={this.state.username}
              id="username"
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <TextField
              id="password"
              onChange={this.onChange('password')}
              type="password"
              name="password"
              value={this.state.password}
              className="login-input"
              placeholder="Password"/>
          </div>

          <Button
            type="Button"
            className="login-btn"
            onClick={this.onLogin}
            >Login
          </Button>
          <Button
            type="Button"
            className="login-btn"
            onClick={this.onToggleMode}
            >Register
          </Button>
        </div>
      </div>
      </div>
    );
    } else {
      return (
      <div className="box-container">
      <div className="inner-container">
        <div className="header">
          Register
        </div>
        <div className="box">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <TextField
              id="username"
              onChange={this.onChange('username')}
              value={this.state.username}
              type="text"
              name="username"
              className="login-input"
              placeholder="Username"/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <TextField
              id="password"
              onChange={this.onChange('password')}
              value={this.state.password}
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"/>
          </div>
          <div className="input-group">
            <label htmlFor="password2">Retype Password</label>
            <TextField
              id="password2"
              onChange={this.onChange('password2')}
              value={this.state.password2}
              type="password"
              name="password"
              className="login-input"
              placeholder="Password"/>
          </div>
          <Button
            type="Button"
            className="login-btn"
            onClick={this.onRegister}>Register
          </Button>
          <Button
            type="Button"
            className="login-btn"
            onClick={this.onToggleMode}
            >Cancel
          </Button>
        </div>
      </div>
      </div>
    );
    }
  }
}
