import React from "react";
import Logo from "./logo";
import LogedUser from "./logedUser";

const Header = props => (
  <div className="header">
    <Logo />
    <LogedUser name={props.head.userName} />
  </div>
);

export default Header;
