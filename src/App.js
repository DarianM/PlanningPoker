import React, { Component } from "react";
import PropTypes from "prop-types";
import Login from "./components/login/login";
import Session from "./components/session/session";

class App extends Component {
  constructor(props) {
    super(props);
    this.game = props.state;
  }
  render() {
    return (
      <div>
        {!this.game.hasJoined ? <Login /> : <Session state={this.game} />}
      </div>
    );
  }
}

App.propTypes = {
  state: PropTypes.object
};

export default App;
