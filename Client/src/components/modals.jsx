import React, { Component } from "react";
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

export class ConnectedToasts extends Component {
  componentDidUpdate() {
    const { toasts, actions } = this.props;
    const hasToasts = Boolean(toasts.length);
    const started = Boolean(this.checkInterval);

    if (hasToasts && !started) {
      this.checkInterval = setInterval(() => {
        actions.removeToast();
      }, 1000);
    }
    if (!hasToasts && started) {
      clearInterval(this.checkInterval);
      this.checkInterval = 0;
    }
  }

  render() {
    const { toasts, actions } = this.props;
    return (
      <ul className="toasts">
        {toasts.map(toast => {
          const { expires } = toast;
          return (
            <Toast
              {...toast}
              key={expires}
              onDismissClick={() => actions.removeToast()}
            />
          );
        })}
      </ul>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ removeToast }, dispatch)
});

const Toast = ({ text, onDismissClick }) => {
  return (
    <li className="toast">
      <p className="toast__content">{text}</p>
      <button type="button" className="toast__dismiss" onClick={onDismissClick}>
        {"\u00D7"}
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
