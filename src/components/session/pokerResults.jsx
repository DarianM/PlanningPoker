import React from "react";

const PokerResults = props => (
  <div id="votesResults" className="results">
    <div className="results-header">Results!</div>
    <div className="players-text">Players:</div>
    <div className="timer">
      <img src="https://planitpoker.azureedge.net/Content/clock.png" />
      <span>'00:00'</span>
    </div>
    <div className="members">*insert every member*</div>
    <div className="controls">
      <ControlButton title={"Flip Cards"} />
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
      // handleClick(e, props.onClick);
    }}
  >
    {props.title}
  </button>
);

const VotesList = ({ vote, user }) => (
  <li>
    <p>
      {user} voted: {vote}
    </p>
  </li>
);

function handleClick(e, option) {
  e.preventDefault();
  switch (option) {
    case "1":
      connection.invoke("ClearVotes", state.room.roomId).catch(function(err) {
        return console.error(err.toString());
      });
    case "2":
      connection
        .invoke("FinishVoting", state.room.roomId, state.history.story)
        .catch(function(err) {
          return console.error(err.toString());
        });
  }
}
