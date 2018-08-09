import React, { Component } from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
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
  overrides: {
    MuiButton: {
      root: {
        background: '#f8bbd0',
        borderRadius: 3,
        border: 0,
        color: 'white',
        margin: 5,
        // height: 48,
        // padding: '0 30px',
        // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
      },
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    colorTextPrimary: "white",
    colorTextSecondary: "black"
  }
});

export default theme;
