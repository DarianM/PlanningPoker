import React from "react";
import PropTypes from "prop-types";

const ButtonsGroup = ({ buttons, onClick }) => {
  const oneBtn = buttons.length === 1;
  return (
    <div className="controls">
      {buttons.map(b => (
        <button
          key={b.id}
          type="button"
          disabled={b.status}
          className={oneBtn ? `${b.className} startgame-control` : b.className}
          onClick={e => {
            e.preventDefault();
            onClick(b.id);
          }}
        >
          {!b.status ? b.text : b.loading}
        </button>
      ))}
    </div>
  );
};

ButtonsGroup.propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired
};

export default ButtonsGroup;
