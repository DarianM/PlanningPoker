import React from "react";
import Connection from "../../websocket";

const SessionChat = props => (
  <div id="message" className="chat">
    <ChatInput />
    <ChatOutput output={props.chat} />
  </div>
);

export default SessionChat;

const ChatInput = props => (
  <div id="chat-input">
    <p>Message...</p>
    <input type="text" id="messageInput" />
    <input
      type="button"
      id="sendButton"
      value="SendMessage"
      onClick={e => {
        e.preventDefault();
        Connection.handleMessage(e.target.value);
      }}
    />
  </div>
);

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
