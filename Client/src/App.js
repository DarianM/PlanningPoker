import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Login from "./components/login/login";
import Session from "./components/session/session";
import { Toasts } from "./components/modals";

const mapStateToProps = state => ({
  hasJoined: state.gameRoom.hasJoined,
  toasts: state.toasts,
  connection: state.connection
});

const ConnectedApp = ({ hasJoined, toasts, connection }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <>
    <div>{!hasJoined ? <Login connection={connection} /> : <Session />}</div>
    <Toasts toasts={toasts} />
  </>
);

ConnectedApp.propTypes = {
  hasJoined: PropTypes.bool.isRequired
};

const App = connect(mapStateToProps)(ConnectedApp);
export default App;
