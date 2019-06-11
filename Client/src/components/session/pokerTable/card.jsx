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
      className="poker-card-button"
      value={value}
      onClick={e => {
        e.preventDefault();
        onClick({ value });
      }}
    />
  </div>
);

Card.propTypes = {
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

export default Card;
