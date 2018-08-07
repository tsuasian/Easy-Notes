import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js'
import RaisedButton from 'material-ui/RaisedButton';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import Popover from '@material-ui/core/Popover';
import Paper from '@material-ui/core/Paper';
import Grow from '@material-ui/core/Grow';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

//material ui - flat button - menu - menuitem -  popover  draft js custom styles


import createStyles from 'draft-js-custom-styles';
const customStyleMap = {
 MARK: {
   backgroundColor: 'Yellow',
   fontStyle: 'italic',
 },
};
const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'PREFIX_', customStyleMap);
const fontSizes = [ 12,18,24,30,40,60 ];


class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      open: false,

    };
    this.onChange = (editorState) => this.setState({editorState});
  };

  _handleMenuToggle = () => {
    this.setState({ open: !this.state.open });
  };

  _handleMenuClose = event => {
      if (this.anchorEl.contains(event.target)) {
        return;
      }

      this.setState({ open: false });
    };

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onHighLightClick(e){
    this.onChange(styles.toggle(this.state.editorState, 'MARK'));
  }

  _onFontSizeClick(e){
    this._handleMenuClose(e);
    var newFontSize = e.target.value;
    console.log(this);
    this.onChange(styles.fontSize.toggle(this.state.editorState, newFontSize)); //probably change this more...og was:  fontSize => {const newEditorState = styles.fontSize.toggle(this.state.editorState, fontSize); return this.updateEditorState(newEditorState);
  }

  render() {
    const fonts = x => x.map((fontSize, index) => {
      return <MenuItem key={index} value={fontSize} onClick={(e)=>this._onFontSizeClick(e)}>{fontSize}</MenuItem>;
    });
    return (
      <div>
        <div>
          <Button onClick={(e) => this._onBoldClick(e)}>
            Bold
          </Button>
          <Button onClick={(e) => this._onItalicClick(e)}>
            Italic
          </Button>
          <Button onClick={(e) => this._onHighLightClick(e)}>
            Highlight
          </Button>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={this.state.open ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this._handleMenuToggle}
          >
          Font Size
          </Button>
          <Popper open={this.state.open} anchorEl={this.anchorEl} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
                >
                <Paper>
                  <ClickAwayListener onClickAway={this._handleMenuClose}>
                    <MenuList>
                      {fontSizes.map((fontSize, index)=><MenuItem key={index} value={fontSize} onClick={(e)=>this._onFontSizeClick(e)}>{fontSize}</MenuItem>)}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
        <div className="editor">
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default Textbox;
