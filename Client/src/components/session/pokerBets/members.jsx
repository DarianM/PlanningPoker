import React from "react";
import PropTypes from "prop-types";

const Members = ({ members, votes }) => (
  <div className="members">
    {members.map(item => (
      <div key={item.id} className="player">
        <div className="member-logo-status" />
        <div className="member-logo" />
        <div id="name">{item.member}</div>
        {!votes.flip ? (
          <div id="voted-state">{item.voted && <span>Voted!</span>}</div>
        ) : (
          <div id="vote">
            {item.voted ? (
              votes.list.find(e => e.user === item.member).voted
            ) : (
              <span>?</span>
            )}
          </div>
        )}
      </div>
    ))}
  </div>
);

Members.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  votes: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    flip: PropTypes.bool,
    nextVoteId: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

export default Members;
