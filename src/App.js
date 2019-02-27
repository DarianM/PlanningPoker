import React, { Component } from "react";
import Login from "./components/login/login";
import Session from "./components/session/session";
import StateStore from "./stores/stateStore";
import Run from "./index";

const title = " TEst this Minimal React Webpack Babel Setup1";
const Tittle = props => <h1>{props.text}</h1>;

class App extends Component {
  constructor(props) {
    super(props);
    this.game = props.state;
  }
  render() {
    return (
      <div>
        <Tittle text={title} />
        <h1>Hello Title</h1>
        <h1>{this.game.room.id}</h1>
        {!this.game.hasJoined ? <Login /> : <Session />}
      </div>
    );
  }
}

export default App;
