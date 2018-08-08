import React from 'react';
import axios from 'axios'
class DocPortal extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      user: undefined,
      socket: this.props.socket,
      documents: [],
      newDocumentName: "",
    }

    this.createDocument = this.createDocument.bind(this);
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

    //create document
    this.state.socket.on('documentCreated', (newDocument) => {
      var documents = self.state.documents.slice();
      documents.push(newDocument);
      self.setState({documents})
    })
  }

  onChange(newName){
    this.setState({
      newDocumentName: newName
    })
  }

  createDocument()  {
    console.log("emitting createDoc event");
    var user = this.state.user.user;
    var docname = this.state.newDocumentName
    this.state.socket.emit('createDoc', {user, docname})
  }

  render() {
    console.log(this.state.user);
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
          onClick={this.createDocument}
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
