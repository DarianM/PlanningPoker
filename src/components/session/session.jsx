import React from "react";
import Header from "./header/header";
import SessionRoomId from "./sessionRoomId";
import PokerTable from "./pokerTable/pokerTable";
import Chart from "./chart";
import PokerResults from "./pokerResults";
import SessionStories from "./stories";
import SessionChat from "./chat";

const Session = props => (
  <div className="body-session">
    <div className="sessionContainer">
      <Header />
      <SessionRoomId />
      {!state.votes.end ? <PokerTable /> : <Chart />}
      <PokerResults />
      <SessionStories />
      <SessionChat />
    </div>
  </div>
);

export default Session;
