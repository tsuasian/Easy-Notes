import React from 'react';
import Title from './title.js'
import Toolbar from './toolbar.js'
import Textbox from './textbox.js'
import axios from 'axios'
class Document extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    console.log("user", this.state.user);
    return (
      <div>
        <Title/>
        <Toolbar/>
        <Textbox/>
      </div>
    );
  }
}


export default Document;
