import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getActiveStory } from "../../selectors";

const mapStateToProps = state => {
  const { text: story, id } = getActiveStory(state);
  const players = state.gameRoom.members.length;
  const { votes } = state.stories.byId[id];
  const average =
    votes.reduce((acc, curr) => {
      return curr.vote === "1/2" ? acc + 0.5 : acc + Number(curr.vote);
    }, 0) / votes.length;
  return { story, players, average };
};

const ConnectedChart = ({ story, players, average }) => (
  <div className="chart-container">
    <div className="chart-title">{story}</div>
    <div className="chart-donut">
      <div className="donut-circle1">
        {players}
        {players > 1 ? "Players" : "Player"}
      </div>
      <div className="donut-circle2">voted</div>
      <div className="donut-circle3">Avg: {average}</div>
    </div>
    <div className="chart-votes">
      <ul>
        <li />
        <span />
        <li />
        <span />
      </ul>
    </div>
  </div>
);

ConnectedChart.propTypes = {
  story: PropTypes.string.isRequired,
  players: PropTypes.number.isRequired,
  average: PropTypes.number.isRequired
};

export default connect(
  mapStateToProps,
  null
)(ConnectedChart);
