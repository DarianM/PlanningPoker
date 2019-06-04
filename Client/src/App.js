import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Login from "./components/login/login";
import Session from "./components/session/session";
import { Toasts } from "./components/modals";

const mapStateToProps = state => ({
  hasJoined: state.gameRoom.hasJoined,
  toasts: state.toasts,
  connection: state.connection,
  hash: window.location.hash
});

const ConnectedApp = ({ hasJoined, toasts, connection, hash }) => (
  <>
    <div>
      {!hasJoined ? <Login connection={connection} hash={hash} /> : <Session />}
    </div>
    <Toasts toasts={toasts} />
  </>
);

ConnectedApp.propTypes = {
  hasJoined: PropTypes.bool.isRequired,
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  connection: PropTypes.shape({
    isLoading: PropTypes.bool,
    error: PropTypes.string
  }).isRequired,
  hash: PropTypes.string.isRequired
};

const App = connect(mapStateToProps)(ConnectedApp);
export default App;
