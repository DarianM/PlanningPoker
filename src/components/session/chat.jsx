import React, { Component } from "react";
import Connection from "../../websocket";

const SessionChat = props => (
  <div id="message" className="chat">
    <ChatInput />
    <ChatOutput output={props.chat} />
  </div>
);

export default SessionChat;

class ChatInput extends Component {
  constructor(props) {
    super(props);

    this.state = { message: "" };
  }
  render() {
    return (
      <div id="chat-input">
        <p>Message...</p>
        <input
          type="text"
          id="messageInput"
          onChange={e => {
            this.state.message = e.target.value;
          }}
        />
        <input
          type="button"
          id="sendButton"
          value="SendMessage"
          onClick={e => {
            e.preventDefault();
            Connection.handleMessage(this.state.message);
          }}
        />
      </div>
    );
  }
}

const ChatOutput = props => (
  <div id="chat-output">
    <ul id="messageList">
      {props.output.chat.messages.map((message, index) => (
        <li key={index}>
          {props.output.room.userName} says: {message}
        </li>
      ))}
    </ul>
  </div>
);
