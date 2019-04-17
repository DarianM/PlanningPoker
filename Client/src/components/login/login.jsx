import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../actions/roomActions";

function mapDispatchToProps(dispatch) {
  return {
    login: user => dispatch(actions.login(user))
  };
}

export class ConnectedLogin extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      id: -1
    };
    this.handleUser = this.handleUser.bind(this);
    this.handleJoinId = this.handleJoinId.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async handleNewSession(event) {
    event.preventDefault();
    const { login } = this.props;
    const { user } = this.state;
    login({user});
    const response = await fetch("/api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user })
    });
  }

  handleJoinSession(event) {
    event.preventDefault();
    const { login } = this.props;
    const { user } = this.state;
    const { id } = this.state;
    login({ user, id });
  }

  handleUser(event) {
    this.setState({ user: event.target.value });
  }

  handleJoinId(event) {
    this.setState({ id: event.target.value });
  }

  render() {
    return (
      <>
        <div className="container">
          <div className="log-session">
            <h2>Poker Planning!</h2>
            <div id="user">
              <h4>User:</h4>
              <input
                id="userName"
                className="sessionId"
                type="text"
                placeholder="Name"
                onChange={this.handleUser}
              />
            </div>
            <button
              type="button"
              id="startSession"
              className="session-button"
              onClick={this.handleNewSession}
            >
              Start a Session
            </button>
            <h4>... or ...</h4>
            <div id="joinId">
              <input
                id="gameId"
                className="sessionId"
                type="text"
                placeholder="Session ID"
                onChange={this.handleJoinId}
              />
            </div>
            <button
              type="button"
              id="joinSession"
              className="session-button"
              onClick={this.handleJoinSession}
            >
              Join a Session
            </button>
          </div>
        </div>
      </>
    );
  }
}

ConnectedLogin.propTypes = {
  login: PropTypes.func.isRequired
};

const Login = connect(
  null,
  mapDispatchToProps
)(ConnectedLogin);
export default Login;
