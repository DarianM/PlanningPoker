import React from "react";
import PropTypes from "prop-types";

const StatusMessage = ({ start, end, flip, members }) => {
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

export default StatusMessage;

StatusMessage.propTypes = {
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

StatusMessage.defaultProps = {
  start: PropTypes.instanceOf(undefined),
  end: PropTypes.instanceOf(undefined)
};
