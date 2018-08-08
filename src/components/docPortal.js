import React from 'react';
import axios from 'axios'
class DocPortal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      user: undefined,
      socket: this.props.socket,
      documents: undefined,
      newDocumentName: "",
    }
  }
  componentDidMount() {

    //    SETUP USERS
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

  onChange(newName){
    this.setState({
      newDocumentName: newName
    })
  }
  render() {
    return (
      <div className="container">
        <div className="header">
          {this.state.user ? this.state.user.user.username + "'s documents" : 'loading'}
        </div>
        <div>
          <input
            id="newDocumentName"
            onChange={(e) => this.setState({newDocumentName: e.target.value})}
            type="text"
            name="newDocumentName"
            value={this.state.newDocumentName}
            className="login-input"
            placeholder="New Document Name"/>
        </div>
        <div>
        <button
          type="button"
          className="login-btn"
          onClick
          >
          Save Document
        </button>
        </div>
          <div className="box container">
          </div>
      </div>
    );
  }
}


export default DocPortal;
