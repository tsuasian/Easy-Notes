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
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import Refresh from '@material-ui/icons/Refresh';
import TextField from '@material-ui/core/TextField';
import theme from './theme/theme.js'
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { createMuiTheme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Assignment from '@material-ui/icons/Assignment';
import Search from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import CssBaseline from '@material-ui/core/CssBaseline';
import CloudUpload from '@material-ui/icons/CloudUpload';
import TagFaces from '@material-ui/icons/TagFaces';
import CircularProgress from '@material-ui/core/CircularProgress';

const NGROK_URL = process.env.NGROK_URL;
class DocPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      socket: this.props.socket,
      //array of document objects
      documents: [],
      newDocumentName: "",
      openShare: false,
      shareUsername: '',
      currentShareDocID: '',
      openUser: false,
      openNewDoc: false,
      docsLoaded: false
    }

    this.createDocument = this.createDocument.bind(this);
  }
  componentDidMount() {
    //    SETUP USERS
    var self = this;
    axios.get('http://localhost:1337'+'/getUser').then(user => {
      self.setState({user: user.data})
    }).then(() => {
      self.state.socket.on('documentCreated', (newDocument) => {
        var documents = self.state.documents.slice();
        //array of document objects
        documents.push(newDocument);
        self.setState({documents})
      })
      self.state.socket.emit('loadDocuments', self.state.user.user)
      self.state.socket.on('documentsLoaded', (newDocArr) => {
        self.setState({documents: newDocArr})
      });
    }).catch(e => {
      console.log("error", e);
    })
  }

  onChange(newName) {
    this.setState({newDocumentName: newName})
  }

  // setSummary(docSummary){
  //   this.props.setSummary(docSummary);
  // }
  //
  // setContents(docContent){
  //   this.props.setContents(docContent);
  // }

  createDocument = () => {
    if (this.state.newDocumentName) {
      //set docsummary and docContent
      var user = this.state.user.user;
      var name = this.state.newDocumentName
      this.state.socket.emit('createDoc', {user, name});
      this.state.socket.on('documentCreated', (documentSummary, documentContents)=>{
        this.props.setSummary(documentSummary);
        this.props.setContents(documentContents);
      })
    } else {
      alert("Please give your document a name!")
    }
  }

  openDocument(e, doc){
    var documentSummary = doc;
    var docId = doc._id;
    // console.log('documentSummary!!!', typeof documentSummary)
    // console.log('docId!!!!: ', docId)
    this.state.socket.emit('loadDocumentContents', {documentId: docId});
    this.state.socket.on('documentContentsLoaded', (documentContent) => {
      this.props.setSummary(documentSummary);
      this.props.setContents(documentContent);
    })
  }

  handleCollaborators(e, doc) {
    console.log("current doc opened", doc)
    this.setState({
      openShare: true,
      currentShareDocID: doc._id
    })
  }

  handleClose() {
    console.log("textfield value state", this.state.shareUsername)
    console.log("doc id", this.state.currentShareDocID)
    this.setState({
      openShare: false
    })
    this.state.socket.emit('inviteUser', {documentId: this.state.currentShareDocID, username: this.state.shareUsername})
  }

  handleJustClose() {
    this.setState({
      openShare: false
    })
  }

  handleOnChange(e) {
    this.setState({
      shareUsername: e.target.value
    })
  }

  Transition(props) {
    return <Slide direction="up" {...props} />;
  }

  _onLogout = () => {
    this.setState({
      openUser: true
    })
    console.log('in logout in docPortal')
  }

  _onCloseUser() {
    this.setState({
      openUser: false
    });
    this.props.logout()
  }

  _onCloseDialog() {
    this.setState({
      openUser: false
    })
  }

  _onCloseDoc() {
    this.setState({
      openNewDoc: false
    })
  }

  _onOpenDoc() {
    this.setState({
      openNewDoc: true
    })
  }

  _refresh() {
    var self = this;
    axios.get('http://localhost:1337'+'/getUser').then(user => {
      self.setState({user: user.data})
    }).then(() => {
      self.state.socket.on('documentCreated', (newDocument) => {
        var documents = self.state.documents.slice();
        //array of document objects
        documents.push(newDocument);
        self.setState({documents})
      })
      self.state.socket.emit('loadDocuments', self.state.user.user)
      self.state.socket.on('documentsLoaded', (newDocArr) => {
        self.setState({documents: newDocArr})
      });
    }).catch(e => {
      console.log("error", e);
    })
  }

  render() {
    return (<div className="container-docportal">
      <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className="navbar-container">
        <AppBar postion="static" color="primary" className="appbarDoc">
          <Toolbar>
            <Typography variant="title" color="textPrimary" style={{flexGrow: 1}}>
                {
                  this.state.user
                    ? this.state.user.user.username + "'s documents"
                    : 'loading'
                }
            </Typography>
            <Button varient="fab" onClick={() => this._refresh()}>
              <Refresh />
            </Button>
            <Button varient="fab" onClick={() => this._onOpenDoc()} className="logoutButton">
              <AddIcon />
              <Assignment />
            </Button>
            <Dialog
              open={this.state.openNewDoc}
              onClose={() => this._onCloseDoc()}
              >
              <DialogTitle id="alert-dialog-title">{"Add New Document"}</DialogTitle>
              <DialogContent>
                <div className="newDocDiv">
                  {/* <Paper className="newDocInput"> */}
                  <div>
                    <TextField id="newDocumentName"
                      onChange={(e) => this.setState({newDocumentName: e.target.value})}
                      type="text" name="newDocumentName"
                      label="Create New Document"
                      value={this.state.newDocumentName}
                      className="login-input"
                      placeholder="Enter New Document Name"/>
                  </div>
                  <div className="newdocButton">
                      <Button className="login-btn btnStyleCustom" onClick={this.createDocument.bind(this)}>
                        Create New Document
                      </Button>
                  </div>
                  {/* </Paper> */}
                </div>
              </DialogContent>
            </Dialog>

            <Button varient="fab" onClick={this._onLogout} className="logoutButton">
              <AccountCircle />
            </Button>
            <Dialog
              open={this.state.openUser}
              onClose={() => this._onCloseDialog()}
              >
              <DialogTitle id="alert-dialog-title">{"User Settings"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to Logout?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => this._onCloseDialog()} color="secondary">
                  Cancel
                </Button>
                <Button onClick={() => this._onCloseUser()} color="secondary">
                  Logout
                </Button>
              </DialogActions>
            </Dialog>
          </Toolbar>
        </AppBar>
      </div>
      <Divider />
      {/* documents pulled from db */}
      <Paper className="docsPaper">
        <Table className="tableDoc">
          <TableHead>
            <TableRow>
              <TableCell style={{fontSize: 14}} variant="head">Document Names</TableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{overflow:"auto"}}>
            <TableRow>
              <TableCell>
                <List>
                {this.state.documents.map((document) => {
                    return (
                      <div key={document._id} className="renderDocsandButton">
                          <ListItem
                              className="listDoc"
                              key={document._id}
                              button={true}
                              value={document}
                              onClick={(e)=>this.openDocument(e, document)}
                            >
                            <ListItemIcon>
                              <Assignment />
                            </ListItemIcon>
                            <ListItemText key={document._id} primary={document.name} />
                          </ListItem>
                        <div className="addCollabDiv">
                          <Button varient="fab" aria-label="Add" className="addCollabButton" onClick={(e) => this.handleCollaborators(e, document)}>
                            <AddIcon/>
                            <TagFaces/>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </List>
                </TableCell>
              </TableRow>
              <Dialog
                open={this.state.openShare}
                onClose={() => this.handleJustClose()}
                >
                <DialogTitle id="alert-dialog-title">{"Share with Others"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Enter the Username of the collaborator you want to share with
                  </DialogContentText>
                  <TextField
                    type="text" name="newDocumentName"
                    label="Add Collaborator"
                    className="tempyeet"
                    placeholder="Enter Username"
                    fullWidth
                    onChange={(e) => this.handleOnChange(e)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => this.handleJustClose()} color="secondary" autoFocus>
                    Cancel
                  </Button>
                  <Button onClick={() => this.handleClose()} color="secondary" autoFocus>
                    Done
                  </Button>
                </DialogActions>
              </Dialog>
        </TableBody>
        </Table>
      </Paper>
      </MuiThemeProvider>
    </div>);
  }
}

export default DocPortal;
