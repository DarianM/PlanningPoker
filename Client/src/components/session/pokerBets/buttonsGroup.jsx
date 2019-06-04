import React from "react";

const ButtonsGroup = ({ buttons, onClick }) => {
  return (
    <div className="controls">
      {buttons.map(b => (
        <button
          type="button"
          disabled={b.status}
          className={b.className}
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

export default ButtonsGroup;
