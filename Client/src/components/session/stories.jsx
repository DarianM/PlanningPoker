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

const mapStateToProps = state => {
  return {
    roomId: state.gameRoom.id,
    stories: state.stories
  };
};

export class ConnectedStories extends Component {
  constructor(props) {
    super(props);
    this.state = { add: true };
    this.handleNewStory = this.handleNewStory.bind(this);
  }

  handleNewStory(storyModal) {
    this.setState({ add: storyModal });
    if (!storyModal) document.body.classList.remove("modal-open");
  }

  render() {
    const { stories, roomId, newStory, deleteStory } = this.props;
    const { add } = this.state;
    if (add) document.body.classList.add("modal-open");
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
            <span className="active-story">Active</span>
          </li>
          <li>
            <span>Completed</span>
          </li>
          <li>
            <span>All</span>
          </li>
          <li className="newstory-btn">
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
          </li>
        </ul>
        <div id="roomstory" className="todaystory">
          <table className="storytable">
            <tbody>
              {stories.allIds.map(id => {
                const { id: storyId, text } = stories.byId[id];
                return !stories.byId[id].end ? (
                  <StoryDescription
                    key={storyId}
                    story={text}
                    roomId={roomId}
                    id={storyId}
                    activeStoryId={stories.activeStoryId}
                    deleteStory={deleteStory}
                  />
                ) : null;
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
ConnectedStories.propTypes = {
  stories: PropTypes.shape({
    byId: PropTypes.shape({}),
    allIds: PropTypes.arrayOf(Number),
    activeStoryId: PropTypes.number
  }),
  roomId: PropTypes.number.isRequired,
  newStory: PropTypes.func.isRequired,
  deleteStory: PropTypes.func.isRequired
};

ConnectedStories.defaultProps = {
  stories: PropTypes.shape({
    byId: PropTypes.shape({}),
    allIds: PropTypes.array
  })
};

const SessionStories = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedStories);

export default SessionStories;
