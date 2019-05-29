import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as room from "../../actions/roomActions";
import * as story from "../../actions/storyActions";

import EditableText from "../editableText";

const mapDispatchToProps = dispatch => ({
  editStory: edit => dispatch(story.editStory(edit)),
  editRoomName: payload => dispatch(room.editRoomName(payload))
});

export const ConnectedSessionInfo = ({
  roomId,
  roomName,
  editRoomName,
  roomHistory,
  editStory
}) => {
  const onActiveStoryChanged = ({ value }) =>
    editStory({ value, id: roomHistory.activeStory.id, roomId });
  const onRoomNameChanged = ({ value }) =>
    editRoomName({ roomName: value, roomId });
  return (
    <div>
      <EditableText text={roomName} commit={onRoomNameChanged} />
      <p className="sessionRoomId">{`your room ID: ${roomId}`}</p>
      {roomHistory.activeStory && (
        <EditableText
          text={roomHistory.activeStory.text}
          commit={onActiveStoryChanged}
        />
      )}
    </div>
  );
};

ConnectedSessionInfo.propTypes = {
  roomName: PropTypes.string.isRequired,
  roomId: PropTypes.number.isRequired,
  roomHistory: PropTypes.shape({
    edit: PropTypes.bool
  }).isRequired,
  editStory: PropTypes.func.isRequired,
  editRoomName: PropTypes.func.isRequired
};

const SessionInfo = connect(
  null,
  mapDispatchToProps
)(ConnectedSessionInfo);
export default SessionInfo;
