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

  const storyNameValidation = value => {
    return new Promise((resolve, reject) => {
      if (new RegExp(/^.{5,40}$/, "g").test(value)) resolve(true);
      else reject(new Error("Story name must have between 5-40 characters"));
    });
  };

  const roomNameValidation = value => {
    return new Promise((resolve, reject) => {
      if (new RegExp(/^.{5,30}$/, "g").test(value)) resolve(true);
      else reject(new Error("room name must be between 5-30 chars"));
    });
  };

  return (
    <div className="sessionInfo">
      <EditableText
        text={roomName}
        commit={onRoomNameChanged}
        validation={roomNameValidation}
      />
      <p className="sessionRoomId">{`your room ID: ${roomId}`}</p>
      {id && (
        <EditableText
          text={text}
          commit={onActiveStoryChanged}
          validation={storyNameValidation}
        />
      )}
    </div>
  );
};

ConnectedSessionInfo.propTypes = {
  roomName: PropTypes.string.isRequired,
  roomId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  activeStory: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    votes: PropTypes.array
  }),
  renameStory: PropTypes.func.isRequired,
  renameRoom: PropTypes.func.isRequired
};

ConnectedSessionInfo.defaultProps = {
  activeStory: PropTypes.shape({
    id: PropTypes.instanceOf(undefined),
    text: PropTypes.instanceOf(undefined),
    start: PropTypes.instanceOf(undefined),
    end: PropTypes.instanceOf(undefined),
    votes: PropTypes.instanceOf(undefined)
  })
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedSessionInfo);
