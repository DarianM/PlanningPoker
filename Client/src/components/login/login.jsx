import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../actions/roomActions";
import { Modal } from "../modals";

import "./login.css";

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
      roomName: "",
      show: false
    };
    this.handleUser = this.handleUser.bind(this);
    this.handleRoomName = this.handleRoomName.bind(this);
    this.handleNewRoomModal = this.handleNewRoomModal.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async handleNewSession() {
    const { createRoom } = this.props;
    const { user } = this.state;
    const { roomName } = this.state;

    createRoom({ user, roomName });
  }

  async handleJoinSession(event) {
    event.preventDefault();
    const { joinRoom } = this.props;
    const { hash } = this.props;
    const roomId = hash.slice(1);
    const { user } = this.state;

    joinRoom({ user, roomId });
  }

  handleUser(event) {
    this.setState({ user: event.target.value });
  }

  handleNewRoomModal() {
    this.setState(state => ({ show: !state.show }));
  }

  handleRoomName(event) {
    this.setState({ roomName: event.target.value });
  }

  render() {
    const { connection, hash } = this.props;
    const { isFetching } = connection;
    const { error } = connection;
    const { show } = this.state;
    return (
      <>
        <div className="container">
          <div className="log-session">
            <div className="header-login">Let&apos;s start!</div>
            <div className="sub-header">Join the room:</div>
            <form className="form-login">
              <div className="user-log">
                <i className="far fa-user" />
                <input
                  id="userName"
                  className="user-input"
                  type="text"
                  placeholder="Name"
                  onChange={this.handleUser}
                />
              </div>

              <button
                type="button"
                id="startSession"
                className="enter-button"
                disabled={isFetching}
                onClick={
                  !hash ? this.handleNewRoomModal : this.handleJoinSession
                }
              >
                {isFetching ? "Processing..." : "Start a Session"}
              </button>
            </form>

            {error && <p className="loginError">{error}</p>}
          </div>
        </div>
        {show && (
          <Modal>
            <div className="modal-header">Create New Room</div>
            <div>
              <input
                placeholder="Enter room name"
                onChange={this.handleRoomName}
              />
            </div>
            <div className="modal-footer">
              <button
                className="votes-blue"
                type="button"
                onClick={e => {
                  e.preventDefault();
                  this.handleNewSession();
                }}
              >
                {`Create`}
              </button>
              <button
                className="votes-option"
                type="button"
                onClick={e => {
                  e.preventDefault();
                  this.handleNewRoomModal();
                }}
              >
                {`Cancel`}
              </button>
            </div>
          </Modal>
        )}
      </>
    );
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
