import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/storyActions";

function mapDispatchToProps(dispatch) {
  return {
    editStory: story => dispatch(actions.editStory(story))
  };
}

function mapStateToProps(state) {
  return {
    stories: state.stories
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

  getVotingDuration(storyId) {
    const { stories } = this.props;
    const { start, end } = stories.byId[storyId];
    const time = Math.round((end - start) / 1000);
    const duration = {
      hours: Math.floor(time / 3600),
      minutes: Math.floor((time / 60) % 60),
      seconds: time % 60
    };
    return `${duration.hours}:${duration.minutes}:${duration.seconds}`;
  }

  validateEditStory() {
    const { newTitle } = this.state;
    return new Promise((resolve, reject) => {
      if (new RegExp(/^\s*(\S\s*){5,30}$/, "g").test(newTitle)) resolve(true);
      else reject(new Error("Story name must have between 5-40 characters"));
    });
  }

  handleError(error) {
    this.setState({ error });
  }

  handleNewTitle(event) {
    this.setState({ newTitle: event.target.value });
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
          <div>{this.getVotingDuration(id)}</div>
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
  mapStateToProps,
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
