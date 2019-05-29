import React, { Component } from "react";
import PropTypes from "prop-types";
import Story from "./storyModal";
import { Modal } from "../modals";

class StoryDescription extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.hideModal = this.hideModal.bind(this);
  }

  hideModal() {
    this.setState({ show: false });
  }

  render() {
    const { story, activeStoryId, deleteStory, id, roomId } = this.props;
    const { show } = this.state;
    const onEditStory = e => {
      e.preventDefault();
      this.setState({ show: true });
    };
    return (
      <>
        <tr>
          <td>
            <button
              type="button"
              onClick={onEditStory}
              tabIndex="0"
              className="table-title"
            >
              <i className="fas fa-list-ul" />
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
              <Modal>
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
  deleteStory: PropTypes.func.isRequired
};

export default StoryDescription;
