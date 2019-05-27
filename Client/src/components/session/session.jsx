import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Header from "./header/header";
import SessionInfo from "./sessionInfo";
import PokerTable from "./pokerTable/pokerTable";
import Chart from "./chart";
import PokerBets from "./pokerBets/pokerBets";
import Stories from "./stories";

const mapStateToProps = state => {
  return {
    game: state.gameRoom,
    history: state.gameHistory,
    votes: state.gameVotes,
    connection: state.connection
  };
};

const ConnectedSession = ({ game, history, votes, connection }) => (
  <div className="sessionContainer">
    <Header head={game.user} />
    <SessionInfo
      roomName={game.roomName}
      roomId={game.id}
      roomHistory={history}
    />
    {!votes.end ? <PokerTable /> : <Chart />}
    <PokerBets stats={game} results={votes} connection={connection} />
    <Stories stories={history} />
  </div>
);

ConnectedSession.propTypes = {
  game: PropTypes.shape({
    user: PropTypes.string,
    id: PropTypes.number
  }).isRequired,
  history: PropTypes.shape({
    storys: PropTypes.arrayOf(PropTypes.object),
    story: PropTypes.string
  }).isRequired,
  votes: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    flip: PropTypes.bool,
    list: PropTypes.arrayOf(
      PropTypes.shape({
        user: PropTypes.string,
        voted: PropTypes.string,
        id: PropTypes.number
      })
    )
  }).isRequired,
  connection: PropTypes.shape({
    isFetching: PropTypes.bool,
    isStarting: PropTypes.bool,
    error: PropTypes.string
  }).isRequired
};

const Session = connect(mapStateToProps)(ConnectedSession);
export default Session;
