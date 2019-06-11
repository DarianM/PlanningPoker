import React from "react";
import { mount } from "enzyme";
import { ConnectedPokerCards } from "./pokerCards";
import Card from "./card";

describe("Card Component", () => {
  it("renders card without crashing", () => {
    const mockAddVote = jest.fn();
    const wrapper = mount(<ConnectedPokerCards addNewVote={mockAddVote} />);
    expect(wrapper.find(".poker-cards").children()).toHaveLength(11);
  });

  describe("user clicks card before game started", () => {
    it("should appear a toast message with game hasn't started yet", () => {
      const mockAddVote = jest.fn();
      const cardWrapper = mount(<Card onClick={mockAddVote} />);

      cardWrapper.find(".poker-card-button").simulate("click");
      expect(mockAddVote).toHaveBeenCalledTimes(1);
    });
  });
});
