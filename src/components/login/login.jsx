import React from "react";
import UserName from "./username";
import LogButton from "./logButton";
import IdGame from "./idGame";

const Login = props => (
  <React.Fragment>
    <div className="container">
      <div className="log-session">
        <h2>Poker Planning</h2>
        <UserName />
        <LogButton id="startSession" text="Start a Session" room="create" />
        <h4>... or ...</h4>
        <IdGame />
        <LogButton id="joinSession" text="Join a Session" room="join" />
      </div>
    </div>
  </React.Fragment>
);

export default Login;
