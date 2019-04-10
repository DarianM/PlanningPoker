import React from "react";
import PropTypes from "prop-types";

const LogedUser = ({ name }) => (
  <div id="userLoged">
    <div className="header-userName">{`User: ${name}`}</div>
    <div className="header-userImg" />
  </div>
);

LogedUser.propTypes = {
  name: PropTypes.string.isRequired
};

export default LogedUser;
