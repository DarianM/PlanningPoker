import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isStarted, isEnded, isFlipped } from "../../../selectors";
import { endGame, resetTimer } from "../../../actions/roomActions";
import {
  startStory,
  deleteVotes,
  flipCards
} from "../../../actions/storyActions";
import ButtonsGroup from "./buttonsGroup";

const mapStateToProps = state => {
  const start = isStarted(state);
  const flip = isFlipped(state);
  const end = isEnded(state);

  const gameStarted = ["flip", "reset", "clear", "next"];
  const flipped = ["end", "reset", "next", "clear"];
  const ended = ["reset", "next"];

  const shows = start ? gameStarted : ["start"];

  return { shows };
};

export const ConnectedGameControls = ({
  shows,
  startStory,
  deleteVotes,
  flipCards,
  endGame,
  resetTimer
}) => {
  const buttons = [
    {
      id: "start",
      text: "Start",
      className: "votes-blue"
    },
    {
      id: "flip",
      text: "Flip Cards",
      className: "votes-option"
    },
    {
      id: "end",
      text: "Finish Voting",
      className: "votes-blue"
    },
    {
      id: "clear",
      text: "Clear Votes",
      className: "votes-option"
    },
    {
      id: "reset",
      text: "Reset Timer",
      className: "votes-option"
    },
    {
      id: "next",
      text: "Next Story",
      className: "votes-option"
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
        endGame();
        break;
      case "reset":
        resetTimer();
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
  { startStory, deleteVotes, flipCards, endGame, resetTimer }
)(ConnectedGameControls);
export default ControlButtons;

ConnectedGameControls.propTypes = {
  roomId: PropTypes.number.isRequired,
  started: PropTypes.instanceOf(Date),
  activeStoryId: PropTypes.number.isRequired,
  results: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    flip: PropTypes.bool
  }).isRequired,
  isStarting: PropTypes.bool.isRequired,
  startCurrentStory: PropTypes.func.isRequired,
  endCurrentGame: PropTypes.func.isRequired,
  flipCards: PropTypes.func.isRequired,
  deleteVotes: PropTypes.func.isRequired,
  resetTimer: PropTypes.func.isRequired,
  stopTimer: PropTypes.func.isRequired,
  startTimer: PropTypes.func.isRequired
};

ConnectedGameControls.defaultProps = {
  started: PropTypes.instanceOf(undefined)
};
