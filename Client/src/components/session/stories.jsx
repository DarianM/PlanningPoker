import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import className from "classnames";
import StoryDescription from "./storyDescription";
import Modal from "../modals";
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
      showStories: [],
      currentShow: "active",
      active: 0,
      completed: 0,
      all: 0
    };
    this.handleNewStory = this.handleNewStory.bind(this);
    this.showStories = this.showStories.bind(this);
    this.getCurrentShowClassNames = this.getCurrentShowClassNames.bind(this);
  }

  componentDidMount() {
    this.showStories("active");
  }

  componentDidUpdate(prevProps) {
    const { stories } = this.props;
    if (stories !== prevProps.stories) {
      const { currentShow } = this.state;
      this.showStories(currentShow);
    }
  }

  getCurrentShowClassNames(list) {
    const { currentShow: clicked } = this.state;
    return className({
      "story-state-choice": true,
      "story-state-clicked": list === clicked
    });
  }

  handleNewStory(storyModal) {
    this.setState({ add: storyModal });
    if (!storyModal) document.body.classList.remove("modal-open");
  }

  showStories(list) {
    const { stories } = this.props;
    const filterStoriesIds = storyFilter =>
      stories.allIds.filter(id => storyFilter(stories.byId[id]));

    const storiesIds = {
      all: stories.allIds,
      active: filterStoriesIds(s => Boolean(!s.end)),
      completed: filterStoriesIds(s => Boolean(s.end))
    };

    this.setState({
      showStories: storiesIds[list],
      active: storiesIds.active.length,
      completed: storiesIds.completed.length,
      all: storiesIds.all.length,
      currentShow: list
    });
  }

  render() {
    const { stories, roomId, newStory, deleteStory } = this.props;
    const { add, showStories, active, completed, all } = this.state;
    if (add) document.body.classList.add("modal-open");
    return (
      <div className="stories">
        {add && (
          <Modal
            cancel={() => {
              this.handleNewStory(false);
            }}
          >
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
              className={this.getCurrentShowClassNames("active")}
              onClick={e => {
                e.preventDefault();
                this.showStories("active");
              }}
            >
              <span className="active-story">{`Active (${active})`}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={this.getCurrentShowClassNames("completed")}
              onClick={e => {
                e.preventDefault();
                this.showStories("completed");
              }}
            >
              <span>{`Completed (${completed})`}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              className={this.getCurrentShowClassNames("all")}
              onClick={e => {
                e.preventDefault();
                this.showStories("all");
              }}
            >
              <span>{`All (${all})`}</span>
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
            <tbody className="droppable" onDragOver={e => e.preventDefault()}>
              {showStories.map(id => {
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
