import React from "react";
import Connection from "../../../websocket";
import StateStore from "../../../stores/stateStore";
import Members from "./members";

const PokerResults = props => (
  <div id="votesResults" className="results">
    <div className="results-header">Results!</div>
    <div className="players-text">Players:</div>
    <div className="timer">
      <img src="https://planitpoker.azureedge.net/Content/clock.png" />
      <span>'00:00'</span>
    </div>
    <Members members={props.result.members} />
    <div className="controls">
      <ControlButton title={"Flip Cards"} onClick={"3"} />
      <ControlButton title={"Clear Votes"} onClick={"1"} />
      <ControlButton title={"Reset Timer"} />
      <ControlButton title={"Finish Voting"} onClick={"2"} />
    </div>
    <ul>
      {props.result.votes.list.map((item, index) => (
        <VotesList key={index} user={item.user} vote={item.voted} />
      ))}
      {/* {state.votes.list.map(item => <li>{state.room.userName} voted {item}</li>)}*/}
    </ul>
  </div>
);

export default PokerResults;

const ControlButton = props => (
  <button
    className="votes-option"
    onClick={e => {
      e.preventDefault();
      Connection.handleControl(props.onClick);
    }}
  >
    {props.title}
  </button>
);

const VotesList = ({ vote, user }) => (
  <li>
    <p>
      {user} voted: {vote} {StateStore.state.votes.flip && <span>{vote}</span>}
    </p>
  </li>
);
