import React from 'react';
import Title from './title.js'
import Toolbar from './toolbar.js'
import Textbox from './textbox.js'

class Document extends React.Component {
  constructor(props){
    super(props);

  }
  render() {
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
