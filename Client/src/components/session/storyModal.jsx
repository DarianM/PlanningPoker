import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/storyActions";

function mapDispatchToProps(dispatch) {
  return {
    editStory: story => dispatch(actions.editStory(story))
  };
}

export class ConnectedStory extends Component {
  constructor(props) {
    super(props);
    this.state = { newTitle: "", error: "" };
    this.handleNewTitle = this.handleNewTitle.bind(this);
    this.handleError = this.handleError.bind(this);
    this.validateEditStory = this.validateEditStory.bind(this);
  }

  handleNewTitle(event) {
    this.setState({ newTitle: event.target.value });
  }

  handleError(error) {
    this.setState({ error });
  }

  validateEditStory() {
    const { newTitle } = this.state;
    return new Promise((resolve, reject) => {
      if (new RegExp(/^.{5,30}$/, "g").test(newTitle)) resolve(true);
      else reject(new Error("Story name must have between 5-40 characters"));
    });
  }

  render() {
    const { story, id, roomId, close, editStory, children } = this.props;
    const { error } = this.state;
    return (
      <>
        <Header close={close} />
        <div className="story-body">
          <div>Title:</div>
          <input
            className="story-detail-input"
            type="text"
            defaultValue={story}
            onChange={this.handleNewTitle}
          />
          <div>Voting duration:</div>
          <div>00:00</div>
          {children}
        </div>
        <div className="modal-footer">
          <button
            className="votes-blue"
            type="button"
            onClick={async e => {
              e.preventDefault();
              const { newTitle } = this.state;
              try {
                await this.validateEditStory();
                editStory({ value: newTitle, id, roomId });
                close();
              } catch (err) {
                this.handleError(err.message);
              }
            }}
          >
            {`Save`}
          </button>
          <button
            className="votes-option"
            type="button"
            onClick={e => {
              e.preventDefault();
              close();
            }}
          >
            {`Close`}
          </button>
          {error && <p>{error}</p>}
        </div>
      </>
    );
  }
}

const Header = ({ close }) => (
  <div className="modal-header">
    <span
      className="close"
      onClick={e => {
        e.preventDefault();
        close();
      }}
      onKeyDown={e => {
        e.preventDefault();
      }}
      role="button"
      tabIndex="0"
    >
      {`\u00D7`}
    </span>
    <div>Story Details</div>
  </div>
);

const StoryModal = connect(
  null,
  mapDispatchToProps
)(ConnectedStory);
export default StoryModal;

Header.propTypes = {
  close: PropTypes.func.isRequired
};

ConnectedStory.propTypes = {
  story: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  roomId: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node,
  editStory: PropTypes.func.isRequired
};

ConnectedStory.defaultProps = {
  children: PropTypes.instanceOf(undefined)
};
