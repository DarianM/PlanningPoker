import React, { Component } from "react";
import PropTypes from "prop-types";
import Story from "./storyModal";
import Modal from "../modals";
import RemoveDialogue from "./storyRemove";

class StoryDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false, remove: false };
    this.openRemoveDialogue = this.openRemoveDialogue.bind(this);
    this.closeRemoveDialogue = this.closeRemoveDialogue.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.onEditStory = this.onEditStory.bind(this);
  }

  onEditStory() {
    this.setState({ show: true });
    document.body.classList.add("modal-open");
  }

  hideModal() {
    this.setState({ show: false });
    document.body.classList.remove("modal-open");
  }

  openRemoveDialogue() {
    this.setState({ remove: true });
    document.body.classList.add("modal-open");
  }

  closeRemoveDialogue() {
    this.setState({ remove: false });
    document.body.classList.remove("modal-open");
  }

  render() {
    const {
      story,
      activeStoryId,
      deleteStory,
      id,
      roomId,
      view,
      dragStart,
      dragOver,
      dragEnd,
      currentDragItem
    } = this.props;
    const { show, remove } = this.state;
    return (
      <>
        <tr
          onDragOver={e => dragOver(e, id)}
          className={id === currentDragItem && "story-drag-hide"}
        >
          <td>
            <button
              type="button"
              onClick={this.onEditStory}
              tabIndex="0"
              className="table-title"
            >
              {view === "active" && (
                <i
                  className="fas fa-list-ul"
                  draggable
                  onDragStart={e => dragStart(e, id)}
                  onDragEnd={dragEnd}
                />
              )}
              <span>{story}</span>
            </button>
          </td>
          <td>
            {id !== activeStoryId && (
              <i
                onClick={() => {
                  this.openRemoveDialogue();
                }}
                onKeyDown={e => {
                  e.preventDefault();
                }}
                role="button"
                tabIndex="0"
                className="far fa-trash-alt"
              />
            )}
          </td>
          <td>
            {remove && (
              <Modal cancel={this.closeRemoveDialogue}>
                <RemoveDialogue
                  id={id}
                  remove={deleteStory}
                  abort={this.closeRemoveDialogue}
                />
              </Modal>
            )}
            {show && (
              <Modal cancel={this.hideModal}>
                <Story
                  story={story}
                  roomId={roomId}
                  id={id}
                  close={this.hideModal}
                >
                  <p>votes here...</p>
                </Story>
              </Modal>
            )}
          </td>
        </tr>
      </>
    );
  }
}

StoryDescription.propTypes = {
  story: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  activeStoryId: PropTypes.number.isRequired,
  deleteStory: PropTypes.func.isRequired,
  roomId: PropTypes.number.isRequired
};

export default StoryDescription;
