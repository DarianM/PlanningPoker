import React from "react";

const ButtonsGroup = ({ buttons, onClick }) => {
  return (
    <div className="controls">
      {buttons.map(b => (
        <button
          type="button"
          className={b.className}
          onClick={e => {
            e.preventDefault();
            onClick(b.id);
          }}
        >
          {b.text}
        </button>
      ))}
    </div>
  );
};

export default ButtonsGroup;
