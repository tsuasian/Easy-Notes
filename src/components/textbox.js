import React from 'react';
import {Editor, EditorState, RichUtils} from 'draft-js'
import RaisedButton from 'material-ui/RaisedButton';
var fontSizes = [ 10,12,14,16,18,20,22,24,26,28,30,40,50 ];
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

  _onItalicClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  render() {
    return (
      <div>
        <RaisedButton onMouseDown={(e) => this._onBoldClick(e)}>Bold</RaisedButton>
        <RaisedButton onMouseDown={(e) => this._onItalicClick(e)}>Italic</RaisedButton>
        <select>
          {fontSizes.map( (num) => <option>{num}</option>)}
        </select>
        <RaisedButton onMouseDown={(e) => this._onBoldClick(e)}>Share</RaisedButton>
        <RaisedButton onMouseDown={(e) => this._onBoldClick(e)}>Save</RaisedButton>
        <div>
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
