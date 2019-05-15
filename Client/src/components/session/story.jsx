import React from "react";
import PropTypes from "prop-types";

const Story = ({ close }) => (
  <React.Fragment>
    <Header close={close} />
    <p>some text...</p>
  </React.Fragment>
);

const Header = ({ close }) => (
  <div className="modal-header">
    <span
      className="close"
      onClick={e => {
        e.preventDefault();
        close();
      }}
      onKeyDown={e => {
        e.preventDefault();
      }}
      role="button"
      tabIndex="0"
    >
      {`\u00D7`}
    </span>
    <div>Story Details</div>
  </div>
);

Story.propTypes = {
  close: PropTypes.func.isRequired
};
Header.propTypes = {
  close: PropTypes.func.isRequired
};

export default Story;
