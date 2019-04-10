import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './components/login/login';
import Session from './components/session/session';

const mapStateToProps = state => ({ hasJoined: state.gameRoom.hasJoined });

const ConnectedApp = ({ hasJoined }) => (
  // eslint-disable-next-line react/jsx-filename-extension
  <div>{!hasJoined ? <Login /> : <Session />}</div>
);

ConnectedApp.propTypes = {
  hasJoined: PropTypes.bool.isRequired,
};

const App = connect(mapStateToProps)(ConnectedApp);
export default App;
