import React from "react";

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

export default ButtonsGroup;
