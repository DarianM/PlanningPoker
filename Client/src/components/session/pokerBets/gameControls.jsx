import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { hasStarted, hasEnded, isFlipped } from "../../../selectors";
import {
  startStory,
  deleteVotes,
  flipCards,
  endStory,
  nextStory,
  resetTimer
} from "../../../actions/storyActions";
import ButtonsGroup from "./buttonsGroup";

const mapStateToProps = state => {
  const start = hasStarted(state);
  const flip = isFlipped(state);
  const end = hasEnded(state);

  const gameStarted = ["flip", "reset", "clear", "next"];
  const flipped = ["end", "reset", "next", "clear"];
  const ended = ["clear", "next"];

  let shows = start ? gameStarted : ["start"];
  shows = start && flip ? flipped : shows;
  shows = end ? ended : shows;
  return { shows, status: state.connection.isLoading };
};

export const ConnectedGameControls = ({
  shows,
  status,
  startStory,
  deleteVotes,
  flipCards,
  endStory,
  nextStory,
  resetTimer
}) => {
  const buttons = [
    {
      id: "start",
      text: "Start",
      className: "votes-blue",
      status,
      loading: "Starting..."
    },
    {
      id: "flip",
      text: "Flip Cards",
      className: "votes-option",
      status,
      loading: "Flipping cards..."
    },
    {
      id: "end",
      text: "Finish Voting",
      className: "votes-blue",
      status,
      loading: "Ending story..."
    },
    {
      id: "clear",
      text: "Clear Votes",
      className: "votes-option",
      status,
      loading: "Clearing votes..."
    },
    {
      id: "reset",
      text: "Reset Timer",
      className: "votes-option",
      status,
      loading: "Reseting timer..."
    },
    {
      id: "next",
      text: "Next Story",
      className: "votes-option",
      status,
      loading: "Waiting for next story..."
    }
  ];
  const onClick = id => {
    switch (id) {
      case "start":
        startStory();
        break;
      case "flip":
        flipCards();
        break;
      case "clear":
        deleteVotes();
        break;
      case "end":
        endStory();
        break;
      case "reset":
        resetTimer();
        break;
      case "next":
        nextStory();
        break;
      default:
        break;
    }
  };
  return (
    <>
      <ButtonsGroup
        buttons={buttons.filter(b => shows.includes(b.id))}
        onClick={onClick}
      />
    </>
  );
};

const ControlButtons = connect(
  mapStateToProps,
  { startStory, deleteVotes, flipCards, endStory, nextStory, resetTimer }
)(ConnectedGameControls);
export default ControlButtons;

ConnectedGameControls.propTypes = {
  shows: PropTypes.arrayOf(String).isRequired,
  status: PropTypes.bool.isRequired,
  startStory: PropTypes.func.isRequired,
  deleteVotes: PropTypes.func.isRequired,
  flipCards: PropTypes.func.isRequired,
  endStory: PropTypes.func.isRequired,
  resetTimer: PropTypes.func.isRequired
};
