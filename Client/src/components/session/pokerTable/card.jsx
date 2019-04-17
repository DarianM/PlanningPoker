import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import actions from "../../../actions/roomActions";
import { addToast } from "../../../actions/toastsActions";

const mapDispatchToProps = dispatch => ({
  addNewVote: (vote, start) =>
    start
      ? (dispatch(actions.addVote(vote)),
        dispatch(actions.memberVoted({ user: vote.user, voted: true })))
      : dispatch(addToast({ text: "Press Start..." }))
});

const mapStateToProps = state => {
  return { loggedUser: state.gameRoom.user, start: state.gameRoom.gameStart };
};

export const ConnectedCard = ({ value, addNewVote, loggedUser, start }) => (
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
        addNewVote({ user: loggedUser, voted: value }, start);
      }}
    />
  </div>
);

ConnectedCard.propTypes = {
  start: PropTypes.instanceOf(Date),
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