import React from "react";
import UserName from "./username";
import LogButton from "./logButton";

const Login = props => (
  <React.Fragment>
    <div className="container">
      <div className="log-session">
        <h2>Poker Planning</h2>
        <UserName />
        <LogButton id="startSession" text="Start a Session" />
        <h4>... or ...</h4>
        <input
          id="joinRoomId"
          className="sessionId"
          type="text"
          placeholder="Session ID"
        />
        <LogButton id="joinSession" text="Join a Session" />
      </div>
    </div>
  </React.Fragment>
);

export default Login;
