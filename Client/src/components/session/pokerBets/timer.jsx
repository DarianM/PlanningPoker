import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getActiveStory } from "../../../selectors";

const mapStateToProps = state => {
  return {
    activeStory: getActiveStory(state)
  };
};

class ConnectedTimer extends Component {
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
    const { activeStory } = this.props;
    const { start } = activeStory;
    if (start) {
      this.startTimer(start);
    }
  }

  componentDidUpdate(prevProps) {
    const { activeStory } = this.props;
    const { start } = activeStory;

    if (prevProps.activeStory.start !== start) {
      this.startTimer(start);
    }
  }

  startTimer(start) {
    if (start) this.clock = setInterval(this.update, 1000);
  }

  stopTimer() {
    clearInterval(this.clock);
  }

  update() {
    const { activeStory } = this.props;
    // if(activeStory.end) stopTimer();
    const { start } = activeStory;
    const time = Math.round((Date.now() - new Date(start)) / 1000);
    this.setState({ minutes: Math.floor(time / 60), seconds: time % 60 });
  }

  render() {
    const { seconds } = this.state;
    const { minutes } = this.state;
    return (
      <div className="timer">
        <i className="far fa-clock" />
        <span>
          {minutes < 10 ? `0${minutes}:` : `${minutes}:`}
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  null
)(ConnectedTimer);
