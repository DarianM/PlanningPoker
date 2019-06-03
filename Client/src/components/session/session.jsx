import React from "react";
import Header from "./header/header";
import SessionInfo from "./sessionInfo";
import PokerTable from "./pokerTable/pokerTable";
import PokerBets from "./pokerBets/pokerBets";
import Stories from "./stories";

export default () => (
  <div className="sessionContainer">
    <Header />
    <SessionInfo />
    <PokerTable />
    <PokerBets />
    <Stories />
  </div>
);
