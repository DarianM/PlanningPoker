import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/roomActions";

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
      roomName: ""
    };
    this.handleUser = this.handleUser.bind(this);
    this.handleRoomName = this.handleRoomName.bind(this);
    this.handleJoinId = this.handleJoinId.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async handleNewSession(event) {
    event.preventDefault();
    const { createRoom } = this.props;
    const { user } = this.state;
    const { roomName } = this.state;

    createRoom({ user, roomName });
  }

  async handleJoinSession(event) {
    event.preventDefault();
    const { joinRoom } = this.props;
    const { user } = this.state;
    const { id } = this.state;
    joinRoom({ user, roomId: id });
  }

  handleUser(event) {
    this.setState({ user: event.target.value });
  }

  handleRoomName(event) {
    this.setState({ roomName: event.target.value });
  }

  handleJoinId(event) {
    this.setState({ id: Number(event.target.value) });
  }

  render() {
    const { connection, hash } = this.props;
    const { isFetching } = connection;
    const { error } = connection;
    return !hash ? (
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
            <div>
              <h4>...optionally room name</h4>
              <input
                type="text"
                placeholder="Room Name"
                className="sessionId"
                onChange={this.handleRoomName}
              />
            </div>
            <button
              type="button"
              id="startSession"
              className="session-button"
              disabled={isFetching}
              onClick={this.handleNewSession}
            >
              {isFetching ? "Processing..." : "Start a Session"}
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
              disabled={isFetching}
              onClick={this.handleJoinSession}
            >
              {isFetching ? "Processing..." : "Join a Session"}
            </button>
            {error && <p className="loginError">{error}</p>}
          </div>
        </div>
      </>
    ) : (<> <div>
      <h1>...HASH...</h1></div> </>);
  }
}

ConnectedLogin.propTypes = {
  createRoom: PropTypes.func.isRequired,
  joinRoom: PropTypes.func.isRequired,
  connection: PropTypes.shape({
    isFetching: PropTypes.bool,
    error: PropTypes.string
  }).isRequired
};

const Login = connect(
  null,
  mapDispatchToProps
)(ConnectedLogin);
export default Login;
