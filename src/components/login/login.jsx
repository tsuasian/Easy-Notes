import React, { Component } from 'react'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';

//theme in progress

import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4fc3f7',
    },
    secondary: {
      main: '#f8bbd0',
    }
  },
  //mui button override
});


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
        <MuiThemeProvider theme={theme}>
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="title" color="white">
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
                  color="secondary"
                  type="Button"
                  className="login-btn"
                  onClick={this.onLogin}
                  >Login
                </Button>
                <Button
                  color="secondary"
                  type="Button"
                  className="login-btn"
                  onClick={this.onSwitchMode.bind(this)}
                  >Register
                </Button>
            </Paper>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}
