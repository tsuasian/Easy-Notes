import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';



export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      mode: true,
      usernmame: "",
      password: "",
    }
  }

  onChange = (field) => (e) => this.setState({
    [field]: e.target.value
  })
  onToggleMode = () => this.setState({
    mode: !this.state.mode
  })

  onSwitchMode(e){
    this.props.switchMode();
  }

  onLogin = () => {
    const {username, password} = this.state;
    this.props.onLogin(username, password);

    // socket.emit('login', {username, password}, (res) => {
    //   navigate(DocumentList)
    // })

  }
  render() {
    return (
      <div className="box-container">
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Login
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="loginPageBody">
          <Paper className="loginPaper" elevation={1}>
            <TextField
              onChange={this.onChange('username')}
              value={this.state.username}
              type="text"
              placeholder="Username"/>

            <TextField
              onChange={this.onChange('password')}
              type="password"
              value={this.state.password}
              placeholder="Password"/>
              <Button
                type="Button"
                className="login-btn"
                onClick={this.onLogin}
                >Login
              </Button>
              <Button
                type="Button"
                className="login-btn"
                onClick={this.onSwitchMode.bind(this)}
                >Register
              </Button>
          </Paper>
        </div>
      </div>
    );
  }
}
