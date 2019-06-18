import React, { Component } from "react";
import PropTypes from "prop-types";

class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = { story: "", error: "" };
    this.handleChange = this.handleChange.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  async handleSaveStory(isMoreToAdd) {
    const { story } = this.state;
    const { addNewStory, addMany, roomId, validation } = this.props;
    try {
      await validation(story);
      addNewStory({ story, roomId });
      addMany(isMoreToAdd);
      if (isMoreToAdd) this.setState({ story: "", error: "" });
    } catch (error) {
      this.handleError(error.message);
    }
  }

  handleChange(event) {
    this.setState({ story: event.target.value });
  }

  handleError(error) {
    this.setState({ error });
  }

  render() {
    const { story, error } = this.state;
    const { addMany } = this.props;
    return (
      <React.Fragment>
        <div className="modal-header">Create New Story</div>
        <div className="modal-center">
          <textarea
            placeholder="Put your story text here."
            className="newstory-textarea"
            onChange={this.handleChange}
            value={story}
          />
        </div>
        <div className="modal-footer">
          <button
            className="votes-blue"
            type="button"
            onClick={e => {
              e.preventDefault();
              this.handleSaveStory(true);
            }}
          >
            {`Save \u0026 Add New`}
          </button>
          <button
            className="votes-blue"
            type="button"
            onClick={e => {
              e.preventDefault();
              this.handleSaveStory(false);
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
          {error && <p>{error}</p>}
        </div>
      </React.Fragment>
    );
  }
}

NewStory.propTypes = {
  addNewStory: PropTypes.func.isRequired,
  addMany: PropTypes.func.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  validation: PropTypes.func.isRequired
};

export default NewStory;
