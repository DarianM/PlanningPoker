import React, { Component } from "react";
import PropTypes from "prop-types";
import { roomNameValidation } from "./validation";

import "./login.css";

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ""
    };
    this.input = React.createRef();
    this.handleCreateRoom = this.handleCreateRoom.bind(this);
  }

  componentDidMount() {
    this.input.current.focus();
  }

  handleCreateRoom(e) {
    e.preventDefault();
    const { create } = this.props;
    const validate = roomNameValidation(this.input.current.value);
    if (validate.message) {
      this.setState({ error: validate.message });
    } else create(this.input.current.value);
  }

  render() {
    const { error } = this.state;
    const { cancel } = this.props;
    return (
      <>
        <div className="modal-header">Create New Room</div>
        <form onSubmit={this.handleCreateRoom}>
          <div className="log-modal-input">
            <input
              type="text"
              className="modal-input-roomname"
              placeholder="Enter room name"
              ref={this.input}
            />
            {error && <p className="loginError">{error}</p>}
          </div>

          <div className="modal-footer">
            <button className="votes-blue" type="submit">
              {`Create`}
            </button>
            <button
              className="votes-option"
              type="button"
              onClick={e => {
                e.preventDefault();
                cancel();
                document.body.classList.remove("modal-open");
              }}
            >
              {`Cancel`}
            </button>
          </div>
        </form>
      </>
    );
  }
}
export default LoginForm;

LoginForm.propTypes = {
  create: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired
};
