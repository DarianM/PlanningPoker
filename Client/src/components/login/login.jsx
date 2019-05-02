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
      roomName: "ABc",
      isLoading: false
    };
    this.handleUser = this.handleUser.bind(this);
    this.handleJoinId = this.handleJoinId.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  // async componentDidMount() {
  //   const response = await fetch("/api/recent");
  //   const data = await response.json();
  //   console.log(data.ip);
  // }

  async handleNewSession(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { createRoom } = this.props;
    const { user } = this.state;
    const { roomName } = this.state;

    createRoom({ user, roomName, component: this });
  }

  async handleJoinSession(event) {
    event.preventDefault();
    this.setState({ isLoading: true });
    const { joinRoom } = this.props;
    const { user } = this.state;
    const { id } = this.state;
    joinRoom({ user, roomId: id, component: this });
  }

  handleUser(event) {
    this.setState({ user: event.target.value });
  }

  handleJoinId(event) {
    this.setState({ id: Number(event.target.value) });
  }

  render() {
    const { isLoading } = this.state;
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
              disabled={isLoading}
              onClick={this.handleNewSession}
            >
              {isLoading ? "Processing..." : "Start a Session"}
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
              disabled={isLoading}
              onClick={this.handleJoinSession}
            >
              {isLoading ? "Processing..." : "Join a Session"}
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
