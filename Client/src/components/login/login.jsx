import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../actions/roomActions";

function mapDispatchToProps(dispatch) {
  return {
    createRoom: user => dispatch(actions.createRoom(user)),
    joinRoom: data => dispatch(actions.joinRoom(data))
  };
}

export class ConnectedLogin extends Component {
  constructor() {
    super();
    this.state = {
      user: "",
      id: -1,
      roomName: "ABc"
    };
    this.handleUser = this.handleUser.bind(this);
    this.handleJoinId = this.handleJoinId.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async handleNewSession(event) {
    event.preventDefault();
    const { createRoom } = this.props;
    const { user } = this.state;
    let { roomName } = this.state;
    const response = await fetch("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, roomName })
    });
    const data = await response.json();
    ({ roomName } = data);
    const { roomId, memberId } = data;
    createRoom({ user, roomId, roomName, memberId });
  }

  async handleJoinSession(event) {
    event.preventDefault();
    const { joinRoom } = this.props;
    const { user } = this.state;
    const { id } = this.state;
    const response = await fetch("/api/member", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user, roomId: id })
    });
    const data = await response.json();
    if (response.status === 400) {
      console.log(data.error);
    } else {
      joinRoom(data);
    }
  }

  handleUser(event) {
    this.setState({ user: event.target.value });
  }

  handleJoinId(event) {
    this.setState({ id: Number(event.target.value) });
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
              {`Start a Session`}
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
              {`Join a Session`}
            </button>
          </div>
        </div>
      </>
    );
  }
}

ConnectedLogin.propTypes = {
  createRoom: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired
};

const Login = connect(
  null,
  mapDispatchToProps
)(ConnectedLogin);
export default Login;
