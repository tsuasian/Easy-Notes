import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import theme from '../theme/theme.js'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

export default class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      mode: true,
      usernmame: "",
      password: "",
      password2: "",
    }
  }

  onChange = (field) => (e) => this.setState({
    [field]: e.target.value
  })

  onRegister = () => {
    const {username, password, password2} = this.state;
    if (password!==password2){
      alert("Passwords must match");
      this.setState({
        password: "",
        password2: "",
      });
    } else{
      this.props.onRegister(username, password);
    }
  }

  onSwitchMode(){
    this.props.switchMode();
  }


  render(){
    return (
      <div className="box-container">
        <MuiThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="white">
              Register
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="loginPageBody">
          <Paper className="loginPaper" elevation={1}>
            <TextField
              onChange={this.onChange('username')}
              value={this.state.username}
              id="username"
              type="text"
              placeholder="Username"/>
            <TextField
              onChange={this.onChange('password')}
              type="password"
              value={this.state.password}
              placeholder="Password"/>
              <TextField
                onChange={this.onChange('password2')}
                type="password"
                value={this.state.password2}
                placeholder="Retype Password"/>
              <Button
                onClick={this.onRegister}
                >Register
              </Button>
              <Button
                onClick={this.onSwitchMode.bind(this)}
                >Click Here To Login
              </Button>
          </Paper>
        </div>
        </MuiThemeProvider>
      </div>

    )
  }
}
