import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userNameValidation } from "./validation";
import * as actions from "../../actions/roomActions";
import { Modal } from "../modals";
import LoginForm from "./loginModal";

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
      error: "",
      show: false
    };
    this.user = React.createRef();
    this.showCreateModal = this.showCreateModal.bind(this);
    this.handleRoomForm = this.handleRoomForm.bind(this);
    this.handleNewSession = this.handleNewSession.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async handleNewSession(roomName) {
    const { createRoom } = this.props;
    const user = this.user.current.value;

    createRoom({ user, roomName });
  }

  async handleJoinSession() {
    const { joinRoom } = this.props;
    const { hash } = this.props;
    const roomId = hash.slice(1);
    const user = this.user.current.value;

    joinRoom({ user, roomId });
  }

  showCreateModal() {
    this.setState(state => ({ show: !state.show }));
  }

  handleRoomForm() {
    this.setState({ error: "" });
    const user = this.user.current.value;
    const validate = userNameValidation(user);
    const { hash } = this.props;
    if (validate.message) {
      this.setState({ error: [validate.message] });
    } else if (hash) {
      this.handleJoinSession();
    } else this.showCreateModal();
  }

  render() {
    const { connection, hash } = this.props;
    const { isLoading } = connection;
    const { error } = this.state;
    const formError = error || connection.error;
    const { show } = this.state;

    return (
      <>
        <div className="container">
          <div className="log-session">
            <div className="header-login">Let&apos;s start!</div>
            <div className="sub-header">
              {!hash ? `Create the room:` : `Join the room:`}
            </div>
            <form className="form-login">
              <div className="user-log">
                <i className="far fa-user" />
                <input
                  id="userName"
                  className="user-input"
                  type="text"
                  placeholder="Name"
                  ref={this.user}
                />
              </div>

              <button
                type="button"
                id="startSession"
                className="enter-button"
                disabled={isLoading}
                onClick={this.handleRoomForm}
              >
                {(isLoading && "Processing...") ||
                  (!hash ? "Start a Session" : "Join a Session")}
              </button>
            </form>

            {formError && (
              <div className="loginError">
                {formError.map(err => (
                  <p key={err}>{err}</p>
                ))}
              </div>
            )}
          </div>
        </div>
        {show && (
          <Modal>
            <LoginForm
              create={this.handleNewSession}
              cancel={this.showCreateModal}
            />
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
    isLoading: PropTypes.bool,
    error: PropTypes.array
  }).isRequired,
  hash: PropTypes.string
};

ConnectedLogin.defaultProps = {
  hash: PropTypes.instanceOf(undefined)
};

const Login = connect(
  null,
  mapDispatchToProps
)(ConnectedLogin);
export default Login;
