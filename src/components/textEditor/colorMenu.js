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
import FormatColorText from '@material-ui/icons/FormatColorText';
const colors = ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];


class ColorMenu extends React.Component {
  constructor(props){
    super(props);
    this.state={
      indexSelected:null
    }
  }

  _setColorAnchorEl(e){
    this.props._setColorAnchorEl(e);
  }

  _handleMenuClose(){
    this.props._handleMenuClose();
  }

  _handleColorChange(e){
    console.log("color changes");
    this.props._handleColorChange(e);
    this.props._handleMenuClose();
  }

  render(){
    return(
      <div>
        <Button
          aria-owns={this.props.colorOpen ? 'color-popper' : null}
          aria-haspopup="true"
          onClick={(e) => this._setColorAnchorEl(e)}>
          <FormatColorText />
        </Button>
        <Popover
          id="color-popper"  //the
          open={this.props.colorOpen}  //open is a required boolean: if true, the popover is open
          anchorEl={this.props.colorAnchorEl} //anchorEl defines the DOM element with which the popover is associated
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
          <Paper style={{maxHeight: 200, overflow: 'auto'}}>
            <ClickAwayListener onClickAway={(e)=>this._handleMenuClose(e)}>
              <MenuList>
                {colors.map( (color, index) =>
                  <MenuItem
                    key={index}
                    value={color}
                    style={{color:String(color), backgroundColor: '#eaecef', borderTop: '1px solid #bdbebf'}}
                    onClick={(e)=>this._handleColorChange(e)}>{color}</MenuItem>
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popover>
      </div>
    )
  }
}
export default ColorMenu;
