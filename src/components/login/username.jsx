import React from "react";
import StoreState from "../../stores/stateStore";

const UserNameLog = props => (
  <div id="user">
    <h4>User:</h4>
    <input
      id="userName"
      className="sessionId"
      type="text"
      placeholder="Name"
      onChange={e => {
        StoreState.setUserName(e.target.value);
        console.log(StoreState.getState());
      }}
    />
  </div>
);

export default UserNameLog;
