import React from "react";
import { mount } from "enzyme";
import { ConnectedCard } from "./card";

describe("Card Component", () => {
  it("renders card without crashing", () => {
    const mockAddVote = jest.fn();
    mount(
      <ConnectedCard
        value="1/2"
        addNewVote={mockAddVote}
        loggedUser="Dave"
        start={null}
      />
    );
  });

  describe("user clicks card before game started", () => {
    it("should appear a toast message with game hasn't started yet", () => {
      const mockAddVote = jest.fn();
      const wrapper = mount(
        <ConnectedCard
          value="1/2"
          addNewVote={mockAddVote}
          loggedUser="Dave"
          start={null}
        />
      );
      wrapper.find(".pokerCardButton").simulate("click");
      expect(mockAddVote.mock.calls).toHaveLength(1);
    });
  });
});
