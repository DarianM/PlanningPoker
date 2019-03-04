import React from "react";
import StateStore from "../../stores/stateStore";

const IdGame = props => (
  <div id="joinId">
    <input
      id="gameId"
      className="sessionId"
      type="text"
      placeholder="Session ID"
      onChange={e => {
        StateStore.setRoomId(e.target.value);
      }}
    />
  </div>
);

export default IdGame;
