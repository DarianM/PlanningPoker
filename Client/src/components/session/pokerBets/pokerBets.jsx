import React, { Component } from "react";
import PropTypes from "prop-types";
import StatusMessage from "./statusMessage";
import GameControls from "./gameControls";
import Members from "./members";

class PokerBets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0
    };

    this.update = this.update.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { stats } = this.props;
    if (prevProps.stats.gameStart !== stats.gameStart) {
      this.startTimer(stats.gameStart);
    }
  }

  startTimer(start) {
    if (start) this.clock = setInterval(this.update, 1000);
  }

  stopTimer() {
    clearInterval(this.clock);
  }

  update() {
    const { stats } = this.props;
    const time = Math.round((Date.now() - stats.gameStart) / 1000);
    this.setState({ minutes: Math.floor(time / 60), seconds: time % 60 });
  }

  render() {
    const { stats } = this.props;
    const { results } = this.props;

    const { seconds } = this.state;
    const { minutes } = this.state;
    return (
      <div id="votesResults" className="results">
        <StatusMessage
          start={stats.gameStart}
          end={results.end}
          flip={results.flip}
          members={stats.members}
        />
        <div className="players-text">Players:</div>
        <div className="timer">
          <i className="far fa-clock" />
          <span>
            {minutes < 10 ? `0${minutes}:` : `${minutes}:`}
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
        </div>
        <Members members={stats.members} votes={results} />
        <GameControls
          game={stats}
          results={results}
          startTimer={this.startTimer}
          stopTimer={this.stopTimer}
        />
      </div>
    );
  }
}

PokerBets.propTypes = {
  stats: PropTypes.shape({
    gameStart: PropTypes.instanceOf(Date),
    user: PropTypes.string,
    id: PropTypes.number,
    hasJoined: PropTypes.bool,
    nextMemberId: PropTypes.number
  }).isRequired,
  results: PropTypes.shape({
    end: PropTypes.instanceOf(Date),
    flip: PropTypes.bool,
    nextVoteId: PropTypes.number,
    list: PropTypes.arrayOf(PropTypes.object)
  }).isRequired
};

export default PokerBets;
