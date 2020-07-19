import React from "react";

import './InputTag.css';

export default class InputTag extends React.Component {
  constructor() {
    super();
  }
  
  removeTag = (i) => {
    const newTags = [ ...this.props.tags];
    const updateTagsCallback = this.props.updateTagsCallback;
    newTags.splice(i, 1);
    updateTagsCallback(newTags);
  }

  inputKeyDown = (e) => {
    const val = e.target.value;
    const updateTagsCallback = this.props.updateTagsCallback;
    if (e.key === 'Enter' && val) {
      if (this.props.tags.find(tag => tag.toLowerCase() === val.toLowerCase())) {
        return;
      }
      updateTagsCallback([...this.props.tags, val]);
      this.tagInput.value = null;
    } else if (e.key === 'Backspace' && !val) {
      this.removeTag(this.props.tags.length - 1);
    }
  }
  
  inputKeyUp = (e) => {
    const val = e.target.value;
    
    const updateInputVal = this.props.updateInputVal;
    
    updateInputVal(val);
  }

  render() {
    const { tags } = this.props;

    return (
      <div className="input-tag">
        <ul className="input-tag__tags">
          { tags.map((tag, i) => (
            <li key={tag}>
              {tag}
              <button type="button" onClick={() => { this.removeTag(i); }}>+</button>
            </li>
          ))}
          <li className="input-tag__tags__input"><input type="text" onKeyDown={this.inputKeyDown} onKeyUp={this.inputKeyUp} placeholder="Enter a genre or artist" ref={c => { this.tagInput = c; }} /></li>
        </ul>
      </div>
    );
  }
}