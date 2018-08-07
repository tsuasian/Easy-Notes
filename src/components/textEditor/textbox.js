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
import Grid from '@material-ui/core/Grid';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import createStyles from 'draft-js-custom-styles';
const customStyleMap = {
 MARK: {
   backgroundColor: 'Yellow',
   fontStyle: 'italic',
 },
};

const { styles, customStyleFn, exporter } = createStyles(['font-size', 'color', 'text-transform'], 'PREFIX_', customStyleMap);
const fontSizes = [ 12,18,22,30,40,60 ];
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];

class Textbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      fontSizeMenuOpen: false,
      colorMenuOpen: false,
      anchorEl: null,

    };
    this.onChange = (editorState) => this.setState({editorState});
    this.customStyleFn = (editorState) => this.setState({editorState})
  };

  _handleFontSizeMenuToggle = () => {
    this.setState({ fontSizeMenuOpen: !this.state.fontSizeMenuOpen });
  };

  _handleFontSizeMenuClose = event => {
      if (this.anchorEl.contains(event.target)) {
        return;
      }
      this.setState({ fontSizeMenuOpen: false });
    };

  _handleColorMenuClose = event => {
      if (this.anchorEl.contains(event.target)) {
        return;
      }
      this.setState({ colorMenuOpen: false });
    };

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  _onItalicClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  _onFontSizeClick(e){
    this._handleFontSizeMenuClose(e);
    var newFontSize = String(e.target.value).concat('px');
    this.customStyleFn(styles.fontSize.toggle(this.state.editorState, newFontSize));
  }

  _onColorClick(e){
    e.preventDefault();
    var newColor = e.target.getAttribute('value');
    this.setState({ anchorEl: null });
    this.customStyleFn(styles.color.toggle(this.state.editorState, newColor));
  }

  _handleColorMenuOpen = event => {
      this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    return (
      <div>
        <div>
          <Button onClick={(e) => this._onBoldClick(e)}>
            Bold
          </Button>
          <Button onClick={(e) => this._onItalicClick(e)}>
            Italic
          </Button>

          {/* Color menu */}
          <Button
            aria-owns={anchorEl ? 'menu-list-grow' : null}
            aria-haspopup="true"
            onClick={this._handleColorMenuOpen}
          >
            Colors
          </Button>
          <Menu
            id="menu-list-grow"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this._handleColorMenuClose}
          >
            <Grid>
              {colors.map( (color, index) =>
                <Grid key={index} value={color} item>
                  <MenuItem
                    value={color}
                    style={{color:String(color), backgroundColor: '#eaecef', borderTop: '1px solid #bdbebf'}}
                    onClick={(e) => this._onColorClick(e)}>{color}
                  </MenuItem>
              </Grid> )}
            </Grid>
          </Menu>

          {/* Font size menu */}
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={this.state.fontSizeMenuOpen ? "menu-list-grow" : null}
            aria-haspopup="true"
            onClick={this._handleFontSizeMenuToggle}
          >
          Font Size
          </Button>
          <Popper open={this.state.fontSizeMenuOpen}
            anchorEl={this.anchorEl}
            transition disablePortal>
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
                  <ClickAwayListener onClickAway={this._handleFontSizeMenuClose}>
                    <MenuList>  {/* probably change this to table*/}
                      {fontSizes.map((fontSize, index) =>
                        <MenuItem className='fontSizeMenuItem'
                          key={index}
                          value={fontSize}
                          onClick={(e)=>this._onFontSizeClick(e)}>
                            {fontSize}
                          </MenuItem>
                        )}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>

        {/* Text input box */}
        <div className="editor">
          <Editor
            customStyleFn={customStyleFn}
            customStyleMap={customStyleMap}
            editorState={this.state.editorState}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}

export default Textbox;
