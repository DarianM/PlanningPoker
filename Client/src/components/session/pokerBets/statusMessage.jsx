import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isFlipped, hasStarted, hasEnded } from "../../../selectors";

const mapStateToProps = state => {
  return {
    start: hasStarted(state),
    flip: isFlipped(state),
    end: hasEnded(state),
    members: state.gameRoom.members
  };
};

export const ConnectedStatusMessage = ({ start, end, flip, members }) => {
  const player = members.find(e => !e.voted);
  return (
    <div id="status-message" className="results-header">
      {!start ? (
        <div>Press Start to begin</div>
      ) : (
        <div>
          {player && !flip ? (
            `Waiting for ${
              members.length < 3 ? player.member : `${members.length} players`
            } to vote`
          ) : (
            <div>
              {!end
                ? "Waiting for moderator to finalise"
                : "Story voting completed"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default connect(
  mapStateToProps,
  null
)(ConnectedStatusMessage);

ConnectedStatusMessage.propTypes = {
  start: PropTypes.bool.isRequired,
  end: PropTypes.bool.isRequired,
  flip: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member: PropTypes.string,
      voted: PropTypes.bool
    })
  ).isRequired
};
