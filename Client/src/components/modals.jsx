import React, { Component } from "react";
import PropTypes from "prop-types";

class Modal extends Component {
  constructor(props) {
    super(props);
    this.escFunction = this.escFunction.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction);
  }

  escFunction(event) {
    const { cancel } = this.props;
    if (event.keyCode === 27) cancel();
  }

  render() {
    const { children } = this.props;
    return (
      <div id="storyModal" className="modal">
        <div className="modal-content">{children}</div>
      </div>
    );
  }
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  cancel: PropTypes.func.isRequired
};

export default Modal;
