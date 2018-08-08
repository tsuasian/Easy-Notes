import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js'
import createStyles from 'draft-js-custom-styles';
//Material UI components
import Button from '@material-ui/core/Button';
import Popover from '@material-ui/core/Popover';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ColorMenu from './ColorMenu';
import FontMenu from './FontMenu';

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'PREFIX_');

class Document extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      colorAnchorEl: null,
      fontAnchorEl: null,
    }
    this.onChange = (editorState) => this.setState({editorState});
    this.customStyleFn = (editorState) => this.setState({editorState})
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _hangleColorChange(e){
    this._setColorAnchorEl(e);
    var newColor = e.target.getAttribute('value');
    this.customStyleFn(styles.color.toggle(this.state.editorState, newColor));
  }

  _setColorAnchorEl(e){
    this.setState({
      colorAnchorEl: e.currentTarget
    })
  }

  _hangleFontChange(e){
    this._setFontAnchorEl(e);
    var newFontSize = String(e.target.value).concat('px');
    this.customStyleFn(styles.fontSize.toggle(this.state.editorState, newFontSize));
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


  render(){
    const { colorAnchorEl } = this.state;
    const { fontAnchorEl } = this.state;

    const colorOpen = Boolean(colorAnchorEl);
    const fontOpen = Boolean(fontAnchorEl);

    return(
      <div>
        <Button onClick={(e) => this._onBoldClick(e)}>
          Bold
        </Button>
        <Button onClick={(e) => this._onItalicClick(e)}>
          Italic
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


        <div className="editor">
          <Editor
            customStyleFn={customStyleFn}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

export default Document;
