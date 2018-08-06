import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js'
import RaisedButton from 'material-ui/RaisedButton';
{/* <RaisedButton color="primary">Bold</RaisedButton> */}
class Textbox extends React.Component {
  constructor(props) {
   super(props);
   this.state = {editorState: EditorState.createEmpty()};
   this.onChange = (editorState) => this.setState({editorState});
 }

 _onBoldClick(e) {
   e.preventDefault()
   this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
 }

 render() {
   return (<div>
     <RaisedButton onMouseDown={(e) => this._onBoldClick(e)}>BOLD</RaisedButton>
     <Editor
       editorState={this.state.editorState}
       onChange={this.onChange}
     />
   </div>);
 }
}

export default Textbox;
