import React from 'react';
import axios from 'axios'

class DocPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      socket: this.props.socket,
      //array of document objects
      documents: [],
      newDocumentName: ""
    }

    this.createDocument = this.createDocument.bind(this);
  }
  componentDidMount() {
    //    SETUP USERS
    var self = this;
    axios.get('http://localhost:1337/getUser')
      .then(user => {
      self.setState({user: user.data})
    })
      .then(() => {
      self.state.socket.on('documentCreated', (newDocument) => {
        var documents = self.state.documents.slice();
        //array of document objects
        documents.push(newDocument);
        self.setState({documents})
      })
      console.log("state user before emit", self.state.user.user)
      self.state.socket.emit('loadDoc', self.state.user.user)
      self.state.socket.on('docsLoaded', (newDocArr) => {
        console.log("received doc arr", newDocArr)
        self.setState({documents: newDocArr})
      });
      console.log("documents state set and this is the name", this.state.documents[0].name);
    })
      .catch(e => {
      console.log("error", e);
    })

    //    FETCH OWNER'S DOCUMENTS
    // for (var docId in )

    //    DOCUMENT CREATED

  }

  onChange(newName) {
    this.setState({newDocumentName: newName})
  }

  createDocument() {
    console.log("emitting createDoc event");
    var user = this.state.user.user;
    var name = this.state.newDocumentName
    // console.log("document name", docname);
    this.state.socket.emit('createDoc', {user, name})
  }

  render() {
    console.log("documents state in render", this.state.documents);

    // console.log("documents id in render", this.state.documents._id)
    return (<div className="container">
      <div className="header">
        {
          this.state.user
            ? this.state.user.user.username + "'s documents"
            : 'loading'
        }
      </div>
      <div>
        <input id="newDocumentName" onChange={(e) => this.setState({newDocumentName: e.target.value})} type="text" name="newDocumentName" value={this.state.newDocumentName} className="login-input" placeholder="New Document Name"/>
      </div>
      <div>
        <button type="button" className="login-btn" onClick={this.createDocument}>
          Save Document
        </button>
      </div>

      <div className="container-documents">
        {this.state.documents.map((document) => {
            return <p>{document.name}</p>
          })}
        <div>
          <button type="button" className="login-btn">
            Edit Document
          </button>
        </div>
      </div>

    </div>);
  }
}

export default DocPortal;
