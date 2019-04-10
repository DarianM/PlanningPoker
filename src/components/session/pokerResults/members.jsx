import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../../actions/roomActions";

const mapDispatchToProps = dispatch => ({
  displayUserVote: vote => dispatch(actions.memberVoted(vote)) // useless
});

const mapStateToProps = state => {
  return { votes: state.gameVotes };
};

const ConnectedMembers = ({ members, votes }) => (
  <div className="members">
    {members.map(item => (
      <div key={item.id} className="player">
        <div className="member-logo-status" />
        <div className="member-logo" />
        <div>{item.member}</div>
        {!votes.flip ? (
          <div>{item.voted && <span>Voted!</span>}</div>
        ) : (
          <div>
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

ConnectedMembers.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      member: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  votes: PropTypes.shape({
    end: PropTypes.bool,
    flip: PropTypes.bool,
    nextVoteId: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

const Members = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedMembers);
export default Members;
