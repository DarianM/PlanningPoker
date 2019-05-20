import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addVote } from "../../../actions/voteActions";
import { addToast } from "../../../actions/toastsActions";

const mapDispatchToProps = dispatch => ({
  addNewVote: (vote, start) =>
    start
      ? dispatch(addVote(vote))
      : dispatch(addToast({ text: "Press Start..." }))
});

const mapStateToProps = state => {
  return {
    loggedUser: state.gameRoom.user,
    room: state.gameRoom.id,
    start: state.gameRoom.gameStart
  };
};

export const ConnectedCard = ({
  value,
  addNewVote,
  loggedUser,
  room,
  start
}) => (
  <div className="vote-point">
    <p className="corner">{value}</p>
    <p className="corner" />
    <p className="corner" />
    <p className="corner">{value}</p>
    <input
      type="button"
      id="card"
      className="pokerCardButton"
      value={value}
      onClick={e => {
        e.preventDefault();
        addNewVote({ user: loggedUser, roomId: room, voted: value }, start);
      }}
    />
  </div>
);

ConnectedCard.propTypes = {
  start: PropTypes.instanceOf(Date),
  room: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  loggedUser: PropTypes.string.isRequired,
  addNewVote: PropTypes.func.isRequired
};

ConnectedCard.defaultProps = {
  start: PropTypes.instanceOf(undefined)
};

const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectedCard);
export default Login;
