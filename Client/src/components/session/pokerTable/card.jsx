import React from "react";
import PropTypes from "prop-types";

const Card = ({ value, onClick }) => (
  <div className="vote-point">
    <p className="corner">{value}</p>
    <p className="corner" />
    <p className="corner" />
    <p className="corner">{value}</p>
    <input
      type="button"
      id="card"
      className="pokerCardButton"
      value={value}
      onClick={e => {
        e.preventDefault();
        onClick({ value });
      }}
    />
  </div>
);

export default Card;
