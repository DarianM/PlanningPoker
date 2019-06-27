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
    this.state = {
      add: true,
      showme: [],
      currentShow: "active",
      activeLength: 0,
      completedLength: 0,
      allLength: 0
    };
    this.handleNewStory = this.handleNewStory.bind(this);
    this.showStories = this.showStories.bind(this);
  }

  componentDidMount() {
    this.showStories("active");
  }

  componentDidUpdate(prevProps) {
    const { stories } = this.props;
    const { currentShow } = this.state;
    if (stories !== prevProps.stories) {
      this.showStories(currentShow);
    }
  }

  handleNewStory(storyModal) {
    this.setState({ add: storyModal });
    if (!storyModal) document.body.classList.remove("modal-open");
  }

  showStories(state) {
    const { stories } = this.props;
    const allLength = stories.allIds.length;
    let those;
    let activeLength;
    let completedLength;
    switch (state) {
      case "active":
        those = stories.allIds.filter(id => !stories.byId[id].end);
        activeLength = those.length;
        completedLength = allLength - activeLength;
        break;
      case "completed":
        those = stories.allIds.filter(id => stories.byId[id].end);
        completedLength = those.length;
        activeLength = allLength - completedLength;
        break;
      default:
        those = stories.allIds;
        activeLength = stories.allIds.filter(id => !stories.byId[id].end)
          .length;
        completedLength = those.length - activeLength;
        break;
    }
    this.setState({
      showme: those,
      activeLength,
      completedLength,
      allLength,
      currentShow: state
    });
  }

  render() {
    const { stories, roomId, newStory, deleteStory } = this.props;
    const {
      add,
      showme,
      activeLength,
      completedLength,
      allLength
    } = this.state;
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
            <button
              type="button"
              className="story-state-choice"
              onClick={e => {
                e.preventDefault();
                this.showStories("active");
              }}
            >
              <span className="active-story">
                {`Active ( ${activeLength} )`}
              </span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="story-state-choice"
              onClick={e => {
                e.preventDefault();
                this.showStories("completed");
              }}
            >
              <span>{`Completed ( ${completedLength} )`}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className="story-state-choice"
              onClick={e => {
                e.preventDefault();
                this.showStories();
              }}
            >
              <span>{`All ( ${allLength} )`}</span>
            </button>
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
              {showme.map(id => {
                const { id: storyId, text } = stories.byId[id];
                return (
                  <StoryDescription
                    key={storyId}
                    story={text}
                    roomId={roomId}
                    id={storyId}
                    activeStoryId={stories.activeStoryId}
                    deleteStory={deleteStory}
                  />
                );
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
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
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
