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
    const { story } = this.props;
    const { activeStoryId } = this.props;
    const { deleteStory } = this.props;
    const { id } = this.props;
    const { show } = this.state;

    return (
      <>
        <tr>
          <td
            className="table-title"
            onClick={e => {
              e.preventDefault();
              this.setState({ show: true });
            }}
            onKeyDown={e => {
              e.preventDefault();
            }}
            role="button"
            tabIndex="0"
          >
            <i className="fas fa-list-ul" />
            <span>{story}</span>
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
                <Story story={story} id={id} close={this.hideModal}>
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
