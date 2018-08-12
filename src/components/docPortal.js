import React from 'react';
import axios from 'axios'
import theme from './theme/theme.js'
import {AppBar, Button,Toolbar,Table,TableBody,Slide,Tooltip,CircularProgress,CssBaseline,
DialogTitle,DialogContentText,DialogContent,DialogActions,ListItemText,Dialog,TableCell,
TableHead,TableRow,Paper,Typography,IconButton,TextField,MuiThemeProvider,styles,
Divider,List,ListItem,ListItemIcon} from '@material-ui/core';
import {Assignment,Search,Add,AccountCircle,Menu,Refresh,Delete,CloudUpload,TagFaces} from '@material-ui/icons';

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
            <Button className="menuIcon" aria-label="Menu">
              <Menu />
            </Button>
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
            <Tooltip disableFocusListener disableTouchListener title="New Document">
              <Button varient="fab" onClick={() => this._onOpenDoc()} className="logoutButton">
                <Add />
                <Assignment />
              </Button>
            </Tooltip>
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
                            <Add/>
                            <TagFaces/>
                          </Button>
                          <Button varient="fab" aria-label="Add" className="addCollabButton" onClick={(e) => this.handleCollaborators(e, document)}>
                            <Delete />
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
