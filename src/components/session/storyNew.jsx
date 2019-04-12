import React, { Component } from "react";
import PropTypes from "prop-types";

class NewStory extends Component {
  constructor(props) {
    super(props);
    this.state = { story: "" };
    this.handleChange = this.handleChange.bind(this);
  }

  handleSaveStory() {
    const { story } = this.state;
    const { addNewStory } = this.props;
    addNewStory({ new: { story, completed: false } });
    this.setState({ story: "" });
  }

  handleChange(event) {
    this.setState({ story: event.target.value });
  }

  render() {
    const { story } = this.state;
    const { addMany } = this.props;
    return (
      <React.Fragment>
        <div className="modal-header">Create New Story</div>
        <div>
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
              this.handleSaveStory();
            }}
          >
            Save &amp; Add New
          </button>
          <button
            className="votes-blue"
            type="button"
            onClick={e => {
              e.preventDefault();
              this.handleSaveStory();
              addMany(false);
            }}
          >
            Save &amp; Close
          </button>
          <button
            className="votes-option"
            type="button"
            onClick={e => {
              e.preventDefault();
              addMany(false);
            }}
          >
            Cancel
          </button>
        </div>
      </React.Fragment>
    );
  }
}

NewStory.propTypes = {
  addNewStory: PropTypes.func.isRequired,
  addMany: PropTypes.func.isRequired
};

export default NewStory;
