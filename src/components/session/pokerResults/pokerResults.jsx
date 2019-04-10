import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StatusMessage from "./status";
import Timer from "./timer";
import Members from "./members";
import SessionChat from "./chat";
import actions from "../../../actions/roomActions";

const mapDispatchToProps = dispatch => ({
  startGame: game => dispatch(actions.startGame(game)),
  flipCards: cards => dispatch(actions.flipCards(cards)),
  deleteVotes: votes => dispatch(actions.deleteVotes(votes)),
  endGame: game => dispatch(actions.endGame(game))
});

const ConnectedPokerResults = ({
  stats,
  results,
  log,
  startGame,
  flipCards,
  deleteVotes,
  endGame
}) => (
  <div id="votesResults" className="results">
    <StatusMessage />
    <div className="players-text">Players:</div>
    <div className="timer">
      <Timer timer={stats.timer} start={stats.gameStart} />
    </div>
    <Members members={stats.members} />
    {!stats.gameStart ? (
      <div className="startgame-control">
        <button
          type="button"
          className="votes-blue"
          onClick={e => {
            e.preventDefault();
            startGame({ gameStart: true });
          }}
        >
          Start
        </button>
      </div>
    ) : (
      <div className="controls">
        {!results.flip ? (
          <button
            type="button"
            className="votes-option"
            onClick={e => {
              e.preventDefault();
              flipCards({ flip: true });
            }}
          >
            Flip Cards
          </button>
        ) : (
          <button
            type="button"
            className="votes-blue"
            onClick={e => {
              e.preventDefault();
              endGame({ end: true });
            }}
          >
            Finish Voting
          </button>
        )}
        <button
          type="button"
          className="votes-option"
          onClick={e => {
            e.preventDefault();
            deleteVotes({ flip: false, list: [] });
          }}
        >
          Clear Votes
        </button>
        <button
          type="button"
          className="votes-option"
          onClick={e => {
            e.preventDefault();
          }}
        >
          Reset Timer
        </button>
        <button
          type="button"
          className="votes-option"
          onClick={e => {
            e.preventDefault();
          }}
        >
          Next Story
        </button>
      </div>
    )}
    <SessionChat chat={log} user={stats.user} />
  </div>
);

ConnectedPokerResults.propTypes = {
  stats: PropTypes.shape({
    user: PropTypes.string,
    id: PropTypes.number,
    hasJoined: PropTypes.bool,
    nextMemberId: PropTypes.number
  }).isRequired,
  results: PropTypes.shape({
    end: PropTypes.bool,
    flip: PropTypes.bool,
    nextVoteId: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  log: PropTypes.shape({
    messages: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  flipCards: PropTypes.func.isRequired,
  deleteVotes: PropTypes.func.isRequired,
  endGame: PropTypes.func.isRequired
};

const PokerResults = connect(
  null,
  mapDispatchToProps
)(ConnectedPokerResults);
export default PokerResults;
