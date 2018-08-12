import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import theme from '../theme/theme.js'
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import Assignment from '@material-ui/icons/Assignment';
import Face from '@material-ui/icons/Face';
import CssBaseline from '@material-ui/core/CssBaseline';
import GoogleLogin from 'react-google-login';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state={
      mode: true,
      username: "",
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
  }

  responseGoogle = (response) => {
    console.log("Google response: ", response);
  }

  render() {
    return (
      <div className="box-container">
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="title" color="textPrimary">
                Login
              </Typography>
            </Toolbar>
          </AppBar>
          <div className="loginPageBody">
            <Paper className="loginPaper" elevation={1}>
              <Assignment />
              <div className="usernameText">
                <Person className="iconsyay"/>
                <TextField
                  onChange={this.onChange('username')}
                  value={this.state.username}
                  type="text"
                  margin="normal"
                  placeholder="Username"
                  />
              </div>
              <div className="usernameText">
                <Lock className="iconsyay" />
                <TextField
                  className="lastinputLog"
                  onChange={this.onChange('password')}
                  type="password"
                  value={this.state.password}
                  margin="normal"
                  placeholder="Password"/>
              </div>
                <Button
                  type="Button"
                  className="login-btn btnStyleCustom"
                  onClick={this.onLogin}
                  >Login
                </Button>
                <GoogleLogin
                  clientId="658977310896-knrl3gka66fldh83dao2rhgbblmd4un9.apps.googleusercontent.com"
                  buttonText="Login"
                  onSuccess={this.responseGoogle}
                  onFailure={this.responseGoogle}
                />
                <Button
                  type="Button"
                  className="login-btn btnStyleCustom"
                  onClick={this.onSwitchMode.bind(this)}
                  >Click Here to Register
                </Button>
            </Paper>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
