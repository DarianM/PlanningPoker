import React from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { removeToast } from "../actions/toastsActions";

const Modal = ({ children }) => {
  return (
    <div id="storyModal" className="modal">
      <div className="modal-content">{children}</div>
    </div>
  );
};

const ConnectedToasts = ({ toasts, actions }) => {
  return (
    <ul className="toasts">
      {toasts.map(toast => {
        const { id } = toast;
        return (
          <Toast
            {...toast}
            key={id}
            onDismissClick={() => actions.removeToast(id)}
          />
        );
      })}
    </ul>
  );
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ removeToast }, dispatch)
});

let timerCount = 0;
const Toast = ({ text, onDismissClick }) => {
  setTimeout(onDismissClick, 3000);
  timerCount += 1;
  return (
    <li className="toast">
      <p className="toast__content">{text}</p>
      <button type="button" className="toast__dismiss" onClick={onDismissClick}>
        {`x`}
      </button>
    </li>
  );
};
const Toasts = connect(
  null,
  mapDispatchToProps
)(ConnectedToasts);
export { Modal, Toasts };

Modal.propTypes = {
  children: PropTypes.node.isRequired
};

ConnectedToasts.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      id: PropTypes.number
    })
  ).isRequired,
  actions: PropTypes.shape({
    removeToast: PropTypes.func
  }).isRequired
};

Toast.propTypes = {
  text: PropTypes.string.isRequired,
  onDismissClick: PropTypes.func.isRequired
};
