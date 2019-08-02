import React, { Component } from "react";
import PropTypes from "prop-types";

class RemoveDialogue extends Component {
  constructor(props) {
    super(props);
    this.state = { error: "" };
  }

  render() {
    const { remove, abort, id } = this.props;
    return (
      <>
        <div className="modal-header">
          Are you sure you want to delete this story?
        </div>
        <div className="modal-footer">
          <button
            className="votes-blue"
            type="button"
            onClick={async e => {
              e.preventDefault();
              await remove({ id });
            }}
          >
            Yes
          </button>
          <button
            // className="votes-blue"
            type="button"
            onClick={async e => {
              e.preventDefault();
              abort();
            }}
          >
            No
          </button>
        </div>
      </>
    );
  }
}

export default RemoveDialogue;
