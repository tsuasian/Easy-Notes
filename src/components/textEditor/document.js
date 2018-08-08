import React from 'react';
import Title from './title.js'
import Toolbar from './toolbar.js'
import Textbox from './textbox.js'
import axios from 'axios'
class Document extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: undefined,
      // socket: this.props.socket
    }
  }

  componentDidMount() {
    var self = this;
    axios.get('http://localhost:1337/getUser')
    .then(user => {
      self.setState({
        user: user.data
      })
    })
    .catch(e => {
      console.log("error", e);
    })
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
