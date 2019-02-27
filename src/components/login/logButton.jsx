import React from "react";

const LoginButton = props => (
  <div>
    <button
      id={props.id}
      className="session-button"
      onClick={e => {
        e.preventDefalut();
      }}
    >
      {props.text}
    </button>
  </div>
);

export default LoginButton;
