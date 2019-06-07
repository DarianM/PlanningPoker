import React, { Component } from "react";
import PropTypes from "prop-types";

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { edit: false, value: "" };
    this.textInput = React.createRef();
    this.editText = this.editText.bind(this);

    this.normalMode = this.normalMode.bind(this);
    this.editMode = this.editMode.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidUpdate() {
    const { edit } = this.state;
    if (edit) this.textInput.current.focus();
  }

  editText(prop) {
    const { text } = this.props;
    this.setState({ edit: prop, value: text });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  normalMode(text) {
    return (
      <div
        className="activestory"
        onClick={e => {
          e.preventDefault();
          this.editText(true);
        }}
        onKeyDown={e => {
          e.preventDefault();
          if (e.keyCode === 13) this.editText(true);
        }}
        role="button"
        tabIndex="0"
      >
        {text}
      </div>
    );
  }

  editMode(commit, text) {
    return (
      <div className="editable-input">
        <input
          ref={this.textInput}
          tabIndex="0"
          className="activestory-input"
          type="text"
          defaultValue={text}
          onChange={this.handleChange}
          onBlur={e => {
            if (
              !e.relatedTarget ||
              e.relatedTarget.className !== "editable-submit"
            )
              this.editText(false);
          }}
        />
        <button
          className="editable-submit"
          type="button"
          onClick={e => {
            e.preventDefault();
            const { value } = this.state;
            commit({ value });
            this.editText(false);
          }}
        >
          <i className="fas fa-check" />
        </button>
      </div>
    );
  }

  render() {
    const { text, commit } = this.props;
    const { value, edit } = this.state;

    return edit ? this.editMode(commit, value) : this.normalMode(text);
  }
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  commit: PropTypes.func.isRequired
};

export default EditableText;
