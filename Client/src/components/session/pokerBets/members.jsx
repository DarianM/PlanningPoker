import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getActiveStory, isFlipped } from "../../../selectors";

const mapStateToProps = state => {
  return {
    activeStory: getActiveStory(state),
    flip: isFlipped(state),
    members: state.gameRoom.members
  };
};

export const ConnectedMembers = ({ activeStory, flip, members }) => (
  <div className="members">
    {members.map(pax => (
      <div key={pax.id} className="player">
        <div className="member-logo-status" />
        <div className="member-logo" />
        <div id="name">{pax.member}</div>
        {!flip ? (
          <div id="voted-state">{pax.voted && <span>Voted!</span>}</div>
        ) : (
          <div id="vote">
            {pax.voted ? (
              activeStory.votes.find(e => e.name === pax.member).vote
            ) : (
              <span>?</span>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

ConnectedMembers.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  flip: PropTypes.bool,
  activeStory: PropTypes.shape({
    votes: PropTypes.array
  }).isRequired
};

ConnectedMembers.defaultProps = {
  flip: PropTypes.instanceOf(undefined)
};

export default connect(
  mapStateToProps,
  null
)(ConnectedMembers);
