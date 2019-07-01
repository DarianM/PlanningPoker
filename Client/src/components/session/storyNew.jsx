import React, { Component } from "react";
import PropTypes from "prop-types";

class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
    this.handleError = this.handleError.bind(this);
    this.validateNewStory = this.validateNewStory.bind(this);
    this.textarea = React.createRef();
  }

  componentDidMount() {
    this.textarea.current.focus();
  }

  async handleSaveStory(isMoreToAdd) {
    const story = this.textarea.current.value;
    const { addNewStory, addMany, roomId } = this.props;
    try {
      await this.validateNewStory();
      addNewStory({ story, roomId });
      addMany(isMoreToAdd);
      if (isMoreToAdd) {
        this.setState({ error: "" });
        this.textarea.current.value = "";
      }
    } catch (error) {
      this.handleError(error.message);
    }
  }

  validateNewStory() {
    const story = this.textarea.current.value;
    return new Promise((resolve, reject) => {
      if (new RegExp(/^\s*(\S\s*){5,30}$/, "g").test(story)) resolve(true);
      else reject(new Error("Story name must have between 5-40 characters"));
    });
  }

  handleError(error) {
    this.setState({ error });
  }

  render() {
    const { error } = this.state;
    const { addMany } = this.props;
    return (
      <>
        <div className="modal-header">Create New Story</div>
        <div className="modal-center">
          <textarea
            placeholder="Put your story text here."
            className="newstory-textarea"
            ref={this.textarea}
          />
          {error && <p className="newstory-error">{error}</p>}
        </div>
        <div className="modal-footer">
          <button
            className="votes-blue"
            type="button"
            onClick={async e => {
              e.preventDefault();
              await this.handleSaveStory(true);
            }}
          >
            {`Save \u0026 Add New`}
          </button>
          <button
            className="votes-blue"
            type="button"
            onClick={async e => {
              e.preventDefault();
              await this.handleSaveStory(false);
            }}
          >
            {`Save \u0026 Close`}
          </button>
          <button
            className="votes-option"
            type="button"
            onClick={e => {
              e.preventDefault();
              addMany(false);
            }}
          >
            {`Cancel`}
          </button>
        </div>
      </>
    );
  }
}

NewStory.propTypes = {
  addNewStory: PropTypes.func.isRequired,
  addMany: PropTypes.func.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
};

export default NewStory;
