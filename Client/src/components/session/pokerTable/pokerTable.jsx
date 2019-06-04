import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PokerCards from "./pokerCards";
import Chart from "../chart";
import { getActiveStory } from "../../../selectors";

const mapStateToProps = state => {
  return { activeStory: getActiveStory(state) };
};

const ConnectedPokerTable = ({ activeStory }) => (
  <>{!activeStory.end ? <PokerCards /> : <Chart />}</>
);

ConnectedPokerTable.propTypes = {
  activeStory: PropTypes.object
};

ConnectedPokerTable.defaultProps = {
  activeStory: PropTypes.instanceOf(undefined)
};

export default connect(
  mapStateToProps,
  null
)(ConnectedPokerTable);
