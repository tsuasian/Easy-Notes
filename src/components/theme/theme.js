import React, { Component } from 'react'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#c2eafc',
      main: '#b3e5fc',
      dark: '#7da0b0'
    },
    secondary: {
      light: '#f6a5c0',
      main: '#f48fb1',
      dark: '#aa647b'
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
    MuiTypography: {
      colorTextPrimary: {
        color:"#FFFFFF"
      },
      colorTextSecondary: {
        color: "#000000",
      }
    }
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
    fontSize: 14,
  }
});

export default theme;
