import React from "react";
import PropTypes from "prop-types";
import Header from "./header/header";
import SessionRoomId from "./sessionRoomId";
import PokerTable from "./pokerTable/pokerTable";
import Chart from "./chart";
import PokerResults from "./pokerResults/pokerResults";
import SessionStories from "./stories";
import SessionChat from "./chat";

const Session = props => (
  <div className="body-session">
    <div className="sessionContainer">
      <Header head={props.state.room} />
      <SessionRoomId roomId={props.state.room.id} />p
      {!props.state.votes.end ? <PokerTable /> : <Chart />}
      <PokerResults result={props.state} />
      <SessionStories stories={props.state} />
      <SessionChat chat={props.state} />
    </div>
  </div>
);

Session.propTypes = {
  state: {
    room: { id: PropTypes.string },
    votes: { end: PropTypes.bool }
  }
};

export default Session;
