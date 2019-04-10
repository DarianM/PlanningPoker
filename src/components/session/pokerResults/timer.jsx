import React, { Component } from "react";
import PropTypes from "prop-types";

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: props.timer.seconds,
      minutes: props.timer.minutes
    };
    this.update = this.update.bind(this);
    this.startTimer = this.startTimer.bind(this);
    const { start } = this.props;
    this.startTimer(start);
  }

  componentDidUpdate(prevProps) {
    const { start } = this.props;
    if (prevProps.start !== start) {
      this.startTimer(start);
    }
  }

  startTimer(props) {
    if (props) setInterval(this.update, 1000);
  }

  update() {
    const { seconds } = this.state;
    const { minutes } = this.state;
    this.setState({ seconds: seconds + 1 });
    if (seconds === 59) {
      this.setState({ seconds: 0, minutes: minutes + 1 });
    }
  }

  render() {
    const { seconds } = this.state;
    const { minutes } = this.state;
    return (
      <React.Fragment>
        <img
          src="https://planitpoker.azureedge.net/Content/clock.png"
          alt="Time Clock"
        />
        <span>
          {minutes < 10 ? `0${minutes}:` : `${minutes}:`}
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </React.Fragment>
    );
  }
}

Timer.propTypes = {
  timer: PropTypes.shape({
    seconds: PropTypes.number,
    minutes: PropTypes.number
  }).isRequired,
  start: PropTypes.bool.isRequired
};

export default Timer;
