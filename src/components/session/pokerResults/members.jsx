import React, { Component } from "react";
import Connection from "../../../websocket";

class Members extends Component {
  constructor(props) {
    super(props);
    this.state = { members: props.members };
  }

  render() {
    return (
      <div className="members">
        {this.state.members.map((member, index) => (
          <div key={index} className="player">
            <div className="member-logo-status" />
            <div className="member-logo" />
            <div>{member}</div>
          </div>
        ))}
      </div>
    );
  }
}

export default Members;
