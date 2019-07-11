import React, { Component } from "react";
import PropTypes from "prop-types";
import Story from "./storyModal";
import Modal from "../modals";

class StoryDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
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

  render() {
    const {
      story,
      activeStoryId,
      deleteStory,
      id,
      roomId,
      dragStart,
      dragOver,
      dragEnd
    } = this.props;
    const { show } = this.state;
    return (
      <>
        <tr onDragOver={e => dragOver(e, id)}>
          <td>
            <button
              type="button"
              onClick={this.onEditStory}
              tabIndex="0"
              className="table-title"
            >
              <i
                className="fas fa-list-ul"
                draggable
                onDragStart={e => dragStart(e, id)}
                onDragEnd={dragEnd}
              />
              <span>{story}</span>
            </button>
          </td>
          <td>
            {id !== activeStoryId && (
              <i
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you wish to delete this story?"
                    )
                  )
                    deleteStory({ id });
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
