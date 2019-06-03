import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Logo from "./logo";
import LogedUser from "./logedUser";

const mapStateToProps = state => {
  return {
    user: state.gameRoom.user
  };
};

const ConnectedHeader = ({ user }) => (
  <div className="header">
    <Logo />
    <LogedUser name={user} />
  </div>
);

ConnectedHeader.propTypes = {
  user: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  null
)(ConnectedHeader);
