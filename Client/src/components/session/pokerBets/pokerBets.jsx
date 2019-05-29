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

  componentDidMount() {
    const { stories } = this.props;
    const { started } = stories.activeStory;
    if (started) {
      this.startTimer(started);
    }
  }

  componentDidUpdate(prevProps) {
    const { stories } = this.props;
    const { started } = stories.activeStory;

    if (prevProps.stories.activeStory.started !== started) {
      this.startTimer(started);
    }
  }

  startTimer(start) {
    if (start) this.clock = setInterval(this.update, 1000);
  }

  stopTimer() {
    clearInterval(this.clock);
  }

  update() {
    const { stories } = this.props;
    const { started } = stories.activeStory;
    const time = Math.round((Date.now() - started) / 1000);
    this.setState({ minutes: Math.floor(time / 60), seconds: time % 60 });
  }

  render() {
    const { stats, stories, results, connection } = this.props;
    const { id } = stats;
    const url = `${window.location.host}/#${id}`;

    const { seconds } = this.state;
    const { minutes } = this.state;
    return (
      <div id="votesResults" className="results">
        <StatusMessage
          start={stories.activeStory.started}
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
          stories={stories}
          results={results}
          connection={connection}
          startTimer={this.startTimer}
          stopTimer={this.stopTimer}
        />
        <div className="invite-link">
          <div>Invite a teammate</div>
          <input type="text" value={url} />
        </div>
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
  }).isRequired,
  connection: PropTypes.shape({
    isFetching: PropTypes.bool,
    isStarting: PropTypes.bool,
    error: PropTypes.string
  }).isRequired
};

export default PokerBets;
