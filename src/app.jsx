import React from 'react';
import Login from './components/login/login'
import Document from './components/textEditor/document';

export default class App extends React.Component {
  render() {
    return (<div className="root-container">
      {/* <Document/> */}
      <Login/>
    </div>);
  }
}
