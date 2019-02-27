import React from "react";

const SessionChat = props => (
  <div id="message" className="chat">
    <ChatInput />
    <ChatOutput />
  </div>
);

export default SessionChat;

const ChatInput = () => (
  <div id="chat-input">
    <p>Message...</p>
    <input type="text" id="messageInput" />
    <input type="button" id="sendButton" value="SendMessage" />
  </div>
);

const ChatOutput = () => (
  <div id="chat-output">
    <ul id="messageList">
      {/* {state.chat.messages.map((item, index) => <li key={index}>{state.room.userName} says: {item}</li>)} */}
    </ul>
  </div>
);
