import React from 'react';
import {Editor, EditorState, RichUtils, convertToRaw, convertFromRaw} from 'draft-js'
import createStyles from 'draft-js-custom-styles';
import ColorMenu from './ColorMenu';
import FontMenu from './FontMenu';
//Material UI components
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
//material ui icons
import FormatUnderlined from '@material-ui/icons/FormatUnderlined';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatStrikethrough from '@material-ui/icons/FormatStrikethrough';
import FormatAlignRight from '@material-ui/icons/FormatAlignRight';
import FormatAlignCenter from '@material-ui/icons/FormatAlignCenter';
import FormatAlignLeft from '@material-ui/icons/FormatAlignLeft';
import SaveAlt from '@material-ui/icons/SaveAlt';
import CloudUpload from '@material-ui/icons/CloudUpload';
import Home from '@material-ui/icons/Home'

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform', 'text-alignment'], 'PREFIX_');
const styleMap = {
  'STRIKETHROUGH': {
    textDecoration: 'line-through'
  }
}

var blockStyleFn = function(block){
  const type = block.getType();
  switch(type){
    case 'right':
      return 'alignRightClass';
      break;

    case 'left':
      return 'alignLeftClass';
      break;

    case 'center':
      return 'alignCenterClass';
      break;
  }
}

class Document extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      colorAnchorEl: null,
      fontAnchorEl: null,
      socket: this.props.socket,
      roomName: String(this.props.docSummary._id)
    }
    this.onChange = (editorState) => {
      this.emitChange(editorState);
      this.setState({editorState})
    };
    this.setDomEditorRef = ref => this.domEditor = ref;
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  componentDidMount(){
    console.log('in component did mount: this.props.docContent: ', this.props.docContent)
    if (this.props.docContent.editorState === null){
      null;
    } else{
      var convertedEditorState = convertFromRaw(JSON.parse(this.props.docContent.editorState));
      this.setState({
          editorState: EditorState.createWithContent(convertedEditorState)
      });
    }

    //join document room, docInfo in this.props.docSummary
    socket.join(this.state.roomName);
    console.log('joined room ', this.state.roomName);

    //listen for do change
    this.state.socket.on('docChange', (editorState) => {
      var convertedEditorState = convertFromRaw(JSON.parse(editorState));
      this.setState({
          editorState: EditorState.createWithContent(convertedEditorState)
      });
    })
  }

  emitChange(editorState){
    //emit change
    var rawJsonEditorState = convertToRaw(editorState.getCurrentContent());
    this.state.socket.to(this.state.roomName).broadcast.emit('docChange', {editorState: JSON.stringify(rawJsonEditorState)})
    })
  }

  handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  _toggleStyle(e){
    e.preventDefault();
    var newStyle = e.currentTarget.getAttribute('value');
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, newStyle));
  }

  _onRightAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'right'));
  }

  _onLeftAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'left'));
  }

  _onCenterAlignClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'center'));
  }

  _hangleColorChange(e){
    this._setColorAnchorEl(e);
    var newColor = e.target.getAttribute('value');
    this.onChange(styles.color.toggle(this.state.editorState, newColor));
  }

  _setColorAnchorEl(e){
    this.setState({
      colorAnchorEl: e.currentTarget
    })
  }

  _hangleFontChange(e){
    this._setFontAnchorEl(e);
    var newFontSize = String(e.target.value).concat('px');
    this.onChange(styles.fontSize.toggle(this.state.editorState, newFontSize));
  }

  _setFontAnchorEl(e){
    this.setState({
      fontAnchorEl: e.currentTarget
    })
  }

  _handleMenuClose(){
    this.setState({
      colorAnchorEl: null,
      fontAnchorEl: null,
    });
  }

  _HandleFocus() {
    this.domEditor.focus()
  }

  _onSaveClick(e){
    var rawJsonEditorState = convertToRaw(this.state.editorState.getCurrentContent()); //maybe EditorState.convertToRaw(this.state.editorState.getCurrentContent());
    this.state.socket.emit('saveDocumentContents', {documentId: this.props.docSummary._id, editorState: JSON.stringify(rawJsonEditorState)})
  }

  _onShareClick(e){
    this.state.socket.emit('shareDocument', {documentId: this.props.document.documentId}) //need to add a newUserId parameter to this emit
  }

  _onBackClick() {
    this.props.docSummary();
  }

  render(){
    const { colorAnchorEl } = this.state;
    const { fontAnchorEl } = this.state;

    const colorOpen = Boolean(colorAnchorEl);
    const fontOpen = Boolean(fontAnchorEl);

    return(
      <div>
        <div className="docshare-toolbar">
          <Button className="toolbar-btn" onClick={this._onSaveClick.bind(this)}>
            <SaveAlt />
          </Button><Button className="toolbar-btn" onClick={(e) => this._onShareClick(e)}>
            <CloudUpload />
          </Button>
          <Button className="toolbar-btn" onClick={()=>this.props.setNull()}>
            <Home/>
          </Button>
        </div>
        <div className="toolbar">
          <Button value="BOLD" className="toolbar-btn" onClick={(e) => this._toggleStyle(e)}>
            <FormatBold />
          </Button>
          <Button value="ITALIC" className="toolbar-btn" onClick={(e) => this._toggleStyle(e)}>
            <FormatItalic />
          </Button>
          <Button value="UNDERLINE" className="toolbar-btn" onClick={(e) => this._toggleStyle(e)}>
            <FormatUnderlined />
          </Button>
          <Button value="STRIKETHROUGH" className="toolbar-btn" onClick={(e) => this._toggleStyle(e)}>
            <FormatStrikethrough />
          </Button>
          <Button className="toolbar-btn" onClick={() => this._onLeftAlignClick()}>
            <FormatAlignLeft />
          </Button>
          <Button className="toolbar-btn" onClick={() => this._onCenterAlignClick()}>
            <FormatAlignCenter />
          </Button>
          <Button className="toolbar-btn" onClick={() => this._onRightAlignClick()}>
            <FormatAlignRight />
          </Button>

          <FontMenu
            _handleMenuClose={(e)=>this._handleMenuClose(e)}
            _setFontAnchorEl={(e)=>this._setFontAnchorEl(e)}
            _handleFontChange={(e)=>this._hangleFontChange(e)}
            fontOpen={fontOpen}
            fontAnchorEl={fontAnchorEl}
          >
          </FontMenu>
          <ColorMenu
            _handleMenuClose={(e)=>this._handleMenuClose(e)}
            _setColorAnchorEl={(e)=>this._setColorAnchorEl(e)}
            _handleColorChange={(e)=>this._hangleColorChange(e)}
            colorOpen={colorOpen}
            colorAnchorEl={colorAnchorEl}
          >
          </ColorMenu>
        </div>
        <div className="editor" onClick={() => this._HandleFocus()}>
          <Editor
            blockStyleFn={blockStyleFn}
            customStyleFn={customStyleFn}
            editorState={this.state.editorState}
            onChange={this.onChange}
            ref={this.setDomEditorRef}
            handleKeyCommand={this.handleKeyCommand}
            customStyleMap={styleMap}
          />
        </div>
      </div>
    )
  }
}

export default Document;
