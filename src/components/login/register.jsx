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
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import Assignment from '@material-ui/icons/Assignment';
import Face from '@material-ui/icons/Face';
import CssBaseline from '@material-ui/core/CssBaseline';

export default class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      mode: true,
      username: "",
      password: "",
      password2: "",
      usernameExists: this.props.usernameExists,
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

  usernameExistsErr(){
    this.setState({
      username: "",
      password: "",
      password2: "",
    });
    alert('Username already exists');
    this.props.resetUsernameExists()
  }


  render(){
    console.log('register.jsx usernameExists', this.props.usernameExists)
    if(this.props.usernameExists){
      this.usernameExistsErr();
    }
    return (
      <div className="box-container">
        <MuiThemeProvider theme={theme}>
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="title" color="textPrimary">
              Register
            </Typography>
          </Toolbar>
        </AppBar>
        <div className="loginPageBody">
          <Paper className="loginPaper" elevation={1}>
            <Face />
            <div className="usernameText">
              <Person className="iconsyay"/>
              <TextField
                onChange={this.onChange('username')}
                value={this.state.username}
                id="username"
                margin="normal"
                type="text"
                placeholder="Username"/>
            </div>
            <div className="usernameText">
              <Lock className="iconsyay"/>
              <TextField
                onChange={this.onChange('password')}
                type="password"
                margin="normal"
                value={this.state.password}
                placeholder="Password"/>
            </div>
            <div className="usernameText">
              <Lock className="iconsyay"/>
              <TextField
                className="lastinputLog"
                onChange={this.onChange('password2')}
                type="password"
                value={this.state.password2}
                margin="normal"
                placeholder="Retype Password"/>
            </div>
              <Button
                className="btnStyleCustom"
                onClick={this.onRegister}
                >Register
              </Button>
              <Button
                className="btnStyleCustom"
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
