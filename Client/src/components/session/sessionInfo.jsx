import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../actions/roomActions";
import EditableText from "../editableText";

const mapDispatchToProps = dispatch => ({
  editStory: story => dispatch(actions.editStory(story))
});

export const ConnectedSessionInfo = ({ roomId, roomHistory, editStory }) => {
  const onTextChanged = ({ value }) =>
    editStory({ value, id: roomHistory.activeStory.id });
  return (
    <div>
      <p className="sessionRoomId">
        your room ID:
        {roomId}
      </p>
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
  roomId: PropTypes.number.isRequired,
  roomHistory: PropTypes.shape({
    edit: PropTypes.bool
  }).isRequired,
  editStory: PropTypes.func.isRequired
};

const SessionInfo = connect(
  null,
  mapDispatchToProps
)(ConnectedSessionInfo);
export default SessionInfo;
