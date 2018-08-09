import React from 'react';
import axios from 'axios'
import {AppBar, Tabs, Tab} from 'material-ui'
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

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
    axios.get('http://localhost:1337/getUser').then(user => {
      self.setState({user: user.data})
    }).then(() => {
      console.log(self.state)
      self.state.socket.on('documentCreated', (newDocument) => {
        var documents = self.state.documents.slice();
        //array of document objects
        documents.push(newDocument);
        self.setState({documents})
      })
      // console.log("state user before emit", self.state.user.user)
      self.state.socket.emit('loadDocuments', self.state.user.user)
      self.state.socket.on('documentsLoaded', (newDocArr) => {
        // console.log("received doc arr", newDocArr)
        self.setState({documents: newDocArr})
      });
    }).catch(e => {
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
    return (<div className="container-docportal">
      <div className="navbar-container">
        <AppBar position="static">
        </AppBar>
      </div>
      <div className="header">
        {
          this.state.user
            ? this.state.user.user.username + "'s documents"
            : 'loading'
        }
      </div>

      {/* documents pulled from db */}
      <div className="container-documents">
        {
          this.state.documents.map((document) => {
            return <Button className="documents-rendered" key={document._id}>{document.name}</Button>
          })
        }
      </div>

      {/* add new document */}
      <div>
        <input id="newDocumentName"
          onChange={(e) => this.setState({newDocumentName: e.target.value})}
          type="text" name="newDocumentName"
          value={this.state.newDocumentName}
          className="login-input"
          placeholder="New Document Name"/>
      </div>
      <div>
        <button type="button" className="login-btn" onClick={this.createDocument}>
          Save Document
        </button>
      </div>
    </div>);
  }
}

export default DocPortal;
