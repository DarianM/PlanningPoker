import React, { Component } from "react";
import PropTypes from "prop-types";

class EditableText extends Component {
  constructor(props) {
    super(props);
    this.state = { edit: false, error: "", value: "" };
    this.textInput = React.createRef();
    this.editText = this.editText.bind(this);

    this.normalMode = this.normalMode.bind(this);
    this.editMode = this.editMode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
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

  handleError(error) {
    this.setState({ error });
  }

  normalMode(text) {
    return (
      <div
        className="activestory"
        onClick={e => {
          e.preventDefault();
          this.editText(true);
          this.handleError("");
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

  editMode(commit, text, validation, error) {
    return (
      <>
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
            onClick={async e => {
              e.preventDefault();
              const { value } = this.state;
              try {
                await validation(value);
                commit({ value });
                this.editText(false);
              } catch (err) {
                this.handleError(err.message);
              }
            }}
          >
            <i className="fas fa-check" />
          </button>
        </div>
        {error && <p>{error}</p>}
      </>
    );
  }

  render() {
    const { text, commit, validation } = this.props;
    const { value, error, edit } = this.state;

    return edit
      ? this.editMode(commit, value, validation, error)
      : this.normalMode(text);
  }
}

EditableText.propTypes = {
  text: PropTypes.string.isRequired,
  commit: PropTypes.func.isRequired,
  validation: PropTypes.func.isRequired
};

export default EditableText;
