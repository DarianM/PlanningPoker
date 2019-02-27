import React from "react";

const Card = props => (
  <div className="vote-point">
    <p className="corner">{props.value}</p>
    <p className="corner" />
    <p className="corner" />
    <p className="corner">{props.value}</p>
    <input
      type="button"
      id="card{value}"
      className="pokerCardButton"
      value={props.value}
    />
  </div>
);

export default Card;
