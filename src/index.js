import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import StateStore from "./stores/stateStore";

const Run = gameState =>
  ReactDOM.render(<App state={gameState} />, document.getElementById("app"));
Run(StateStore.getState());

module.hot.accept();

export default Run;
