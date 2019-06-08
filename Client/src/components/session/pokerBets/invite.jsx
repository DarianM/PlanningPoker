import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const mapStateToProps = state => {
  const { id: roomId } = state.gameRoom;
  return { url: `${window.location.host}/#${roomId}` };
};

const ConnectedInvite = ({ url }) => (
  <div className="invite-link">
    <div>Invite a teammate</div>
    <input
      type="text"
      className="link-input"
      onFocus={e => e.target.select()}
      value={url}
    />
  </div>
);

ConnectedInvite.propTypes = {
  url: PropTypes.string.isRequired
};

export default connect(
  mapStateToProps,
  null
)(ConnectedInvite);
