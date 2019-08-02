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
    deleteStory: story => dispatch(actions.deleteStory(story)),
    reorderStories: story => dispatch(actions.reorderStories(story)),
    reorderingStories: ids => dispatch(actions.reorderingStories(ids)),
    changeView: view => dispatch(actions.changeStoriesView(view))
  };
}

const mapStateToProps = state => {
  const view = state.stories.currentView;
  const { stories } = state;
  const filterStoriesIds = storyFilter =>
    stories.allIds.filter(id => storyFilter(stories.byId[id]));

  const filteredStories = {
    all: stories.allIds,
    active: filterStoriesIds(s => Boolean(!s.end)),
    completed: filterStoriesIds(s => Boolean(s.end))
  };

  return {
    roomId: state.gameRoom.id,
    stories,
    showStories: filteredStories[view],
    currentShow: view,
    active: filteredStories.active.length,
    completed: filteredStories.completed.length,
    all: filteredStories.all.length
  };
};

export class ConnectedStories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      add: true,
      order: props.showStories,
      isOrdering: false
    };
    this.handleNewStory = this.handleNewStory.bind(this);
    this.getCurrentShowClassNames = this.getCurrentShowClassNames.bind(this);

    this.dragStart = this.dragStart.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.dragOver = this.dragOver.bind(this);
  }

  getCurrentShowClassNames(list) {
    const { currentShow: clicked } = this.props;
    return className({
      "story-state-choice": true,
      "story-state-clicked": list === clicked
    });
  }

  handleNewStory(storyModal) {
    this.setState({ add: storyModal });
    if (!storyModal) document.body.classList.remove("modal-open");
  }

  dragStart(e, id) {
    this.draggedItem = id;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  }

  dragEnd() {
    this.setState({ isOrdering: false });
    if (this.draggedItem === this.draggedOverItem) return;
    const { reorderStories } = this.props;
    reorderStories({
      draggedItem: this.draggedItem,
      draggedOverItem: this.draggedOverItem
    });
    this.draggedItem = null;
  }

  dragOver(e, draggedOverItem) {
    e.preventDefault();
    this.draggedOverItem = draggedOverItem;
    const { showStories } = this.props;
    if (this.draggedItem === draggedOverItem) return;
    const items = showStories.filter(item => item !== this.draggedItem);
    items.splice(showStories.indexOf(draggedOverItem), 0, this.draggedItem);
    this.setState({ isOrdering: true, order: items });
  }

  render() {
    const {
      stories,
      roomId,
      newStory,
      deleteStory,
      changeView,
      currentShow,
      showStories,
      active,
      completed,
      all
    } = this.props;
    const { add, order, isOrdering } = this.state;
    const ids = isOrdering ? order : showStories;
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
                changeView("active");
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
                changeView("completed");
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
                changeView("all");
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
        <div className="todaystory">
          <table className="storytable">
            <tbody>
              {ids.map(id => {
                const { id: storyId, text } = stories.byId[id];
                return (
                  <StoryDescription
                    key={storyId}
                    story={text}
                    roomId={roomId}
                    id={storyId}
                    view={currentShow}
                    activeStoryId={stories.activeStoryId}
                    deleteStory={deleteStory}
                    dragStart={this.dragStart}
                    dragOver={this.dragOver}
                    dragEnd={this.dragEnd}
                    currentDragItem={this.draggedItem}
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
