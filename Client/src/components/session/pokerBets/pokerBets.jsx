import React from "react";
import StatusMessage from "./statusMessage";
import GameControls from "./gameControls";
import Members from "./members";
import Timer from "./timer";
import Invite from "./invite";

const PokerBets = () => (
  <div id="votesResults" className="results">
    <StatusMessage />
    <div className="players-text">Players:</div>
    <Timer />
    <Members />
    <GameControls />
    <Invite />
  </div>
);

export default PokerBets;
