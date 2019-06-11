import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getActiveStory } from "../../../selectors";

const mapStateToProps = state => {
  return {
    activeStory: getActiveStory(state)
  };
};

export class ConnectedTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: 0,
      minutes: 0,
      hours: 0
    };

    this.update = this.update.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
  }

  componentDidMount() {
    const { activeStory } = this.props;
    const { start } = activeStory;
    if (start) {
      this.startTimer(start);
    }
  }

  componentDidUpdate(prevProps) {
    const { activeStory } = this.props;
    const { start, end } = activeStory;

    if (!prevProps.activeStory.start && start) {
      this.startTimer(start);
    }
    if (prevProps.activeStory.end && !end) this.startTimer(start);
  }

  startTimer(start) {
    if (start) {
      this.clock = setInterval(this.update, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.clock);
  }

  update() {
    const { activeStory } = this.props;
    if (activeStory.end) this.stopTimer();
    const { start } = activeStory;
    const time = Math.round((Date.now() - new Date(start)) / 1000);
    this.setState({
      hours: Math.floor(time / 3600),
      minutes: Math.floor((time / 60) % 60),
      seconds: time % 60
    });
  }

  render() {
    const { seconds, minutes, hours } = this.state;
    return (
      <div className="timer">
        <i className="far fa-clock" />
        <span className="clock">
          {hours < 10 ? `0${hours}:` : `${hours}:`}
          {minutes < 10 ? `0${minutes}:` : `${minutes}:`}
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </div>
    );
  }
}

ConnectedTimer.propTypes = {
  activeStory: PropTypes.shape({
    id: PropTypes.number,
    text: PropTypes.string,
    start: PropTypes.instanceOf(Date),
    end: PropTypes.instanceOf(Date),
    votes: PropTypes.array
  })
};

ConnectedTimer.defaultProps = {
  activeStory: PropTypes.object
};

export default connect(
  mapStateToProps,
  null
)(ConnectedTimer);
