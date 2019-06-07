import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Card from "./card";
import { addVote } from "../../../actions/storyActions";

const mapDispatchToProps = dispatch => {
  return {
    addNewVote: vote => dispatch(addVote(vote))
  };
};

const cards = ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
export const ConnectedPokerCards = ({ addNewVote }) => (
  <div className="poker-cards">
    {cards.map(x => (
      <Card key={x} value={x} onClick={addNewVote} />
    ))}
  </div>
);

ConnectedPokerCards.propTypes = {
  addNewVote: PropTypes.func.isRequired
};

export default connect(
  null,
  mapDispatchToProps
)(ConnectedPokerCards);
