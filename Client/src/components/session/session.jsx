import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Header from "./header/header";
import SessionInfo from "./sessionInfo";
import PokerTable from "./pokerTable/pokerTable";
import Chart from "./chart";
import PokerBets from "./pokerBets/pokerBets";
import Stories from "./stories";
import { Toasts } from "../modals";

const mapStateToProps = state => {
  console.log(state);
  return {
    game: state.gameRoom,
    history: state.gameHistory,
    votes: state.gameVotes,
    chat: state.chat,
    
  };
};

const ConnectedSession = ({ game, history, votes, chat }) => (
  <div className="body-session">
    <div className="sessionContainer">
      <Header head={game.user} />
      <SessionInfo
        roomName={game.roomName}
        roomId={game.id}
        roomHistory={history}
      />
      {!votes.end ? <PokerTable /> : <Chart />}
      <PokerBets stats={game} results={votes} log={chat} />
      <Stories stories={history} />
    </div>
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
  chat: PropTypes.shape({
    messages: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

const Session = connect(mapStateToProps)(ConnectedSession);
export default Session;
