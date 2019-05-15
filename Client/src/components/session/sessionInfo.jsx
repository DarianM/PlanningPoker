import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/roomActions";
import EditableText from "../editableText";

const mapDispatchToProps = dispatch => ({
  editStory: story => dispatch(actions.editStory(story)),
  editRoomName: roomName => dispatch(actions.editRoomName(roomName))
});

export const ConnectedSessionInfo = ({
  roomId,
  roomName,
  editRoomName,
  roomHistory,
  editStory
}) => {
  const onTextChanged = ({ value }) =>
    editStory({ value, id: roomHistory.activeStory.id });
  return (
    <div>
      <EditableText text={roomName} commit={editRoomName} />
      <p className="sessionRoomId">{`your room ID: ${roomId}`}</p>
      {roomHistory.activeStory && (
        <EditableText
          text={roomHistory.activeStory.text}
          commit={onTextChanged}
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
