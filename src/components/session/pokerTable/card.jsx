import React from "react";
import Connection from "../../../websocket";

const Card = props => (
  <div className="vote-point">
    <p className="corner">{props.value}</p>
    <p className="corner" />
    <p className="corner" />
    <p className="corner">{props.value}</p>
    <input
      type="button"
      id="card"
      className="pokerCardButton"
      value={props.value}
      onClick={e => {
        e.preventDefault();
        Connection.handleVote(e.target.value);
      }}
    />
  </div>
);

export default Card;
