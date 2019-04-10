import React from "react";
import PropTypes from "prop-types";
import Logo from "./logo";
import LogedUser from "./logedUser";

const Header = ({ head }) => (
  <div className="header">
    <Logo />
    <LogedUser name={head} />
  </div>
);

Header.propTypes = {
  head: PropTypes.string.isRequired
};

export default Header;
