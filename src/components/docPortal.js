import React from 'react';
import axios from 'axios'
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import TextField from '@material-ui/core/TextField';
import theme from './theme/theme.js'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';


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
  }

  onChange(newName) {
    this.setState({newDocumentName: newName})
  }

  createDocument() {
    if (this.state.newDocumentName) {
      console.log("emitting createDoc event");
      var user = this.state.user.user;
      var name = this.state.newDocumentName
      // console.log("document name", docname);
      this.state.socket.emit('createDoc', {user, name})
      this.setState({
        newDocumentName: ''
      })
    } else {
      alert("Please give your document a name!")
    }
  }

  render() {
    return (<div className="container-docportal">
      <MuiThemeProvider theme={theme}>
      <div className="navbar-container">
        <AppBar postion="static" color="primary" className="appbarDoc">
          <Toolbar>
            <Typography variant="title" color="textPrimary">
                {
                  this.state.user
                    ? this.state.user.user.username + "'s documents"
                    : 'loading'
                }
            </Typography>
          </Toolbar>
        </AppBar>
      </div>

      {/* documents pulled from db */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Names</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.documents.map((document) => {
                return (
                  <TableRow key={document._id}>
                      <TableCell component="th" scope="row" key={document._id}><Button>{document.name}</Button></TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
        </Table>
      </Paper>

      {/* add new document */}
      <div className="newDocDiv">
        <div id="newDocInput">
          <TextField id="newDocumentName"
            onChange={(e) => this.setState({newDocumentName: e.target.value})}
            type="text" name="newDocumentName"
            value={this.state.newDocumentName}
            className="login-input"
            placeholder="New Document Name"/>
        </div>
        <div>
          <MuiThemeProvider>
            <Button className="login-btn" onClick={this.createDocument}>
              Save Document
            </Button>
          </MuiThemeProvider>
        </div>
      </div>
      </MuiThemeProvider>
    </div>);
  }
}

export default DocPortal;
