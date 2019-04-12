import React from "react";
import Card from "./card";

const cards = ["0", "1/2", "1", "2", "3", "5", "8", "13", "20", "40", "100"];
const PokerCards = () => (
  <div>
    {cards.map(x => (
      <Card key={x} value={x} />
    ))}
  </div>
);

export default PokerCards;
