import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editStory } from "../../actions/storyActions";
import { editRoomName } from "../../actions/roomActions";

import EditableText from "../editableText";
import { getActiveStory } from "../../selectors";

const mapDispatchToProps = dispatch => ({
  renameStory: newValue => dispatch(editStory(newValue)),
  renameRoom: newValue => dispatch(editRoomName(newValue))
});

const mapStateToProps = state => {
  return {
    roomId: state.gameRoom.id,
    roomName: state.gameRoom.roomName,
    activeStory: getActiveStory(state)
  };
};

export const ConnectedSessionInfo = ({
  roomId,
  roomName,
  renameStory,
  renameRoom,
  activeStory
}) => {
  const { id, text } = activeStory;
  const onActiveStoryChanged = ({ value }) =>
    renameStory({ value, id, roomId });
  const onRoomNameChanged = ({ value }) =>
    renameRoom({ roomName: value, roomId });
  return (
    <div>
      <EditableText text={roomName} commit={onRoomNameChanged} />
      <p className="sessionRoomId">{`your room ID: ${roomId}`}</p>
      {activeStory && (
        <EditableText text={text} commit={onActiveStoryChanged} />
      )}
    </div>
  );
};

ConnectedSessionInfo.propTypes = {
  roomName: PropTypes.string.isRequired,
  roomId: PropTypes.number.isRequired,
  activeStory: PropTypes.object,
  renameStory: PropTypes.func.isRequired,
  renameRoom: PropTypes.func.isRequired
};

ConnectedSessionInfo.defaultProps = {
  activeStory: PropTypes.instanceOf(undefined)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSessionInfo);
