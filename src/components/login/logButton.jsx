import React from "react";
import StoreState from "../../stores/stateStore";
import Connection from "../../websocket";

const LoginButton = props => (
  <div>
    <button
      id={props.id}
      className="session-button"
      onClick={e => {
        e.preventDefault();
        {
          props.task == "create"
            ? Connection.createRoom()
            : Connection.joinRoom();
        }
        StoreState.getState().hasJoined = true;
      }}
    >
      {props.text}
    </button>
  </div>
);

export default LoginButton;
