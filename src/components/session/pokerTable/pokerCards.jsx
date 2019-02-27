import React from "react";
import Card from "./card";

var cards = ["0", "1/2", "3", "8", "13", "20", "40", "100", "?"];
const PokerCards = () => (
  <div>
    {cards.map((x, index) => (
      <Card key={index} value={x} />
    ))}
  </div>
);

export default PokerCards;
