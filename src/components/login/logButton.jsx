import React from "react";
import StoreState from "../../stores/stateStore";
import Connection from "../../websocket";
import Run from "../..";

const LoginButton = props => (
  <div>
    <button
      id={props.id}
      className="session-button"
      onClick={e => {
        e.preventDefault();
        if (StoreState.state.room.userName === "") {
          StoreState.state.room.validUser = false;
          Run(StoreState.getState());
        } else {
          props.room === "create"
            ? Connection.createRoom()
            : Connection.joinRoom();
          StoreState.getState().hasJoined = true;
        }
      }}
    >
      {props.text}
    </button>
  </div>
);

export default LoginButton;
