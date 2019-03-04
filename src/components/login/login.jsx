import React, { Component } from "react";
import UserName from "./username";
import LogButton from "./logButton";
import IdGame from "./idGame";
import StateStore from "../../stores/stateStore";

class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <div className="log-session">
            <h2>Poker Planning</h2>
            <UserName />
            {!StateStore.state.room.validUser && (
              <h5>Enter a valid username...</h5>
            )}
            <LogButton id="startSession" text="Start a Session" room="create" />
            <h4>... or ...</h4>
            <IdGame />
            <LogButton id="joinSession" text="Join a Session" room="join" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Login;
