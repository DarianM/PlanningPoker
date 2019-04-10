import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../../actions/roomActions";

function mapDispatchToProps(dispatch) {
  return {
    addNewMessage: message => dispatch(actions.addMessage(message))
  };
}

export const ConnectedChat = ({ chat, user, addNewMessage }) => (
  <div id="message" className="votes-display">
    <ChatInput add={addNewMessage} user={user} />
    <ChatOutput output={chat} />
  </div>
);

ConnectedChat.propTypes = {
  chat: PropTypes.shape({
    messages: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  user: PropTypes.string.isRequired,
  addNewMessage: PropTypes.func.isRequired
};

const SessionChat = connect(
  null,
  mapDispatchToProps
)(ConnectedChat);
export default SessionChat;

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.setState({ message: event.target.value });
  }

  handleClick(event) {
    event.preventDefault();
    const { message } = this.state;
    const { add } = this.props;
    const { user } = this.props;
    add({ message, user });
    this.setState({ message: "" });
  }

  render() {
    const { message } = this.state;
    return (
      <div className="chat-input">
        <p>Message...</p>
        <input
          type="text"
          className="messageInput"
          value={message}
          onChange={this.handleChange}
        />
        <button type="button" className="sendMsg" onClick={this.handleClick}>
          Send Message
        </button>
      </div>
    );
  }
}

ChatInput.propTypes = {
  user: PropTypes.string.isRequired,
  add: PropTypes.func.isRequired
};

const ChatOutput = ({ output }) => (
  <div id="chat-output">
    <ul id="messageList">
      {output.messages.map(item => (
        <li key={item.id}>{`${item.user}:${item.message}`}</li>
      ))}
    </ul>
  </div>
);

ChatOutput.propTypes = {
  output: PropTypes.shape({
    messages: PropTypes.arrayOf(
      PropTypes.shape({
        message: PropTypes.string,
        id: PropTypes.number
      })
    )
  }).isRequired
};
