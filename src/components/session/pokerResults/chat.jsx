import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../../actions/roomActions";
// import Connection from "../../websocket";

function mapDispatchToProps(dispatch) {
  return {
    addNewMessage: message => dispatch(actions.addMessage(message))
  };
}

const ConnectedChat = ({ chat, user, addNewMessage }) => (
  <div id="message" className="votes-display">
    <ChatInput input={addNewMessage} user={user} />
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
      message: "",
      addNew: props.input
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
    const { addNew } = this.state;
    const { user } = this.props;
    addNew({ message, user });
  }

  render() {
    return (
      <div id="chat-input">
        <p>Message...</p>
        <input type="text" id="messageInput" onChange={this.handleChange} />
        <input
          type="button"
          id="sendButton"
          value="SendMessage"
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

ChatInput.propTypes = {
  user: PropTypes.string.isRequired,
  input: PropTypes.func.isRequired
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
