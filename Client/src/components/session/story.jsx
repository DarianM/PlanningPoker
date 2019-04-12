import React from "react";

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
      &times;
    </span>
    <div>Story Detayls</div>
  </div>
);

export default Story;
