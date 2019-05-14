import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/roomActions";

function mapDispatchToProps(dispatch) {
  return {
    editStory: story => dispatch(actions.editStory(story))
  };
}

export class ConnectedStory extends Component {
  constructor(props) {
    super(props);
    this.state = { newTitle: "" };
    this.handleNewTitle = this.handleNewTitle.bind(this);
  }

  handleNewTitle(event) {
    this.setState({ newTitle: event.target.value });
  }

  render() {
    const { story } = this.props;
    const { id } = this.props;
    const { close } = this.props;
    const { editStory } = this.props;
    const { children } = this.props;

    return (
      <React.Fragment>
        <Header close={close} />
        <div className="story-body">
          <div>Title:</div>
          <input
            type="text"
            defaultValue={story}
            onChange={this.handleNewTitle}
          />
          <div>Voting duration:</div>
          <div>00:00</div>
          {children}
        </div>
        <div className="modal-footer">
          <button
            className="votes-blue"
            type="button"
            onClick={e => {
              e.preventDefault();
              const { newTitle } = this.state;
              editStory({ value: newTitle, id });
              close();
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
        </div>
      </React.Fragment>
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
  null,
  mapDispatchToProps
)(ConnectedStory);
export default StoryModal;

Header.propTypes = {
  close: PropTypes.func.isRequired
};

ConnectedStory.propTypes = {
  story: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  children: PropTypes.node,
  editStory: PropTypes.func.isRequired
};

ConnectedStory.defaultProps = {
  children: PropTypes.instanceOf(undefined)
};
