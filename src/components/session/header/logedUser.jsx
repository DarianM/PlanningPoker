import React from "react";

const LogedUser = props => (
  <div id="userLoged">
    <div className="header-userName">User: {props.name}</div>
    <div className="header-userImg" />
  </div>
);

export default LogedUser;
