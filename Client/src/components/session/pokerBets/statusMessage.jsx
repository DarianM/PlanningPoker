import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isFlipped, isStarted, isEnded } from "../../../selectors";

const mapStateToProps = state => {
  return {
    start: isStarted(state),
    flip: isFlipped(state),
    end: isEnded(state),
    members: state.gameRoom.members
  };
};

const ConnectedStatusMessage = ({ start, end, flip, members }) => {
  const player = members.find(e => !e.voted);
  return (
    <div id="status-message" className="results-header">
      {!start ? (
        <div>Press Start to begin</div>
      ) : (
        <div>
          {player && !flip ? (
            `Waiting for ${player.member} to vote`
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
  start: PropTypes.instanceOf(Date),
  end: PropTypes.oneOfType([PropTypes.func, PropTypes.instanceOf(Date)]),
  flip: PropTypes.bool.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member: PropTypes.string,
      voted: PropTypes.bool
    })
  ).isRequired
};

ConnectedStatusMessage.defaultProps = {
  start: PropTypes.instanceOf(undefined),
  end: PropTypes.instanceOf(undefined)
};
