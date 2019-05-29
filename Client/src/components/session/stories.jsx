import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import StoryDescription from "./storyDescription";
import { Modal } from "../modals";
import NewStory from "./storyNew";
import * as actions from "../../actions/storyActions";

function mapDispatchToProps(dispatch) {
  return {
    newStory: story => dispatch(actions.newStory(story)),
    deleteStory: story => dispatch(actions.deleteStory(story))
  };
}

export class ConnectedStories extends Component {
  constructor(props) {
    super(props);
    this.state = { add: true };
    this.handleNewStory = this.handleNewStory.bind(this);
  }

  handleNewStory(prop) {
    this.setState({ add: prop });
  }

  render() {
    const { stories, roomId, newStory, deleteStory } = this.props;
    const activeStoryId = stories.activeStory.id;
    const { add } = this.state;
    return (
      <div className="stories">
        {add && (
          <Modal>
            <NewStory
              roomId={roomId}
              addNewStory={newStory}
              addMany={this.handleNewStory}
            />
          </Modal>
        )}
        <ul className="nav-story">
          <li>
            <span className="active-story">Active Story</span>
          </li>
          <li>
            <span>Completed</span>
          </li>
          <li>
            <span>All Stories</span>
          </li>
          <li>
            <div className="newstory-btn">
              <button
                className="new_btn"
                type="button"
                onClick={e => {
                  e.preventDefault();
                  this.handleNewStory(true);
                }}
              >
                <span>+ New</span>
              </button>
            </div>
          </li>
        </ul>
        <div id="roomstory" className="todaystory">
          <table className="storytable">
            <tbody>
              {stories.stories.map(e =>
                !e.completed ? (
                  <StoryDescription
                    key={e.id}
                    story={e.story}
                    roomId={roomId}
                    id={e.id}
                    activeStoryId={activeStoryId}
                    deleteStory={deleteStory}
                  />
                ) : null
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
ConnectedStories.propTypes = {
  stories: PropTypes.shape({
    story: PropTypes.string
  }).isRequired,
  newStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

const SessionStories = connect(
  null,
  mapDispatchToProps
)(ConnectedStories);

export default SessionStories;
