import React from "react";
import StatusMessage from "./statusMessage";
import GameControls from "./gameControls";
import Members from "./members";
import Timer from "./timer";

const PokerBets = () => (
  <div id="votesResults" className="results">
    <StatusMessage />
    <div className="players-text">Players:</div>
    <Timer />
    <Members />
    <GameControls />
    {/* <div className="invite-link">
      <div>Invite a teammate</div>
      <input type="text" value={url} />
    </div>
  </div> */}
);

export default PokerBets;
