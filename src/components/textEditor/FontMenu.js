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
const fontSizes = [ 12,18,22,30,40,60 ];


class FontMenu extends React.Component {
  constructor(props){
    super(props);
  }

  _setFontAnchorEl(e){
    this.props._setFontAnchorEl(e);
  }

  _handleMenuClose(){
    this.props._handleMenuClose();
  }

  _handleFontChange(e){
    this.props._handleFontChange(e);
    this.props._handleMenuClose();
  }

  render(){
    return(
      <div>
        <Button
          aria-owns={this.props.fontOpen ? 'font-popper' : null}
          aria-haspopup="true"
          variant="contained"
          onClick={(e) => this._setFontAnchorEl(e)}>
          Change Font
        </Button>
        <Popover
          id="font-popper"  //the
          open={this.props.fontOpen}  //open is a required boolean: if true, the popover is open
          anchorEl={this.props.fontAnchorEl} //anchorEl defines the DOM element with which the popover is associated
          onClose={(e)=>this._handleMenuClose(e)}
          //anchorOrigin is the point on the anchor that the popover attaches to
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          // transform origin is the point on the POPPOER which attaches to the anchor
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={(e)=>this._handleMenuClose(e)}>
              <MenuList>
                {fontSizes.map( (font, index) =>
                  <MenuItem
                    key={index}
                    value={font}
                    onClick={(e)=>this._handleFontChange(e)}>{font}</MenuItem>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popover>
      </div>
    )
  }
}
export default FontMenu;
