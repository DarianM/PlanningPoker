import React from "react";
import { mount } from "enzyme";
import { ConnectedGameControls } from "./gameControls";

describe("Poker results Component", () => {
  const mockStartStory = jest.fn();
  const mockFlipCards = jest.fn();
  const mockDeleteVotes = jest.fn();
  const mockEndStory = jest.fn();
  const mockResetTimer = jest.fn();

  const applyMount = shows => {
    return mount(
      <ConnectedGameControls
        shows={shows}
        status={false}
        startStory={mockStartStory}
        deleteVotes={mockDeleteVotes}
        flipCards={mockFlipCards}
        endStory={mockEndStory}
        resetTimer={mockResetTimer}
      />
    );
  };

  describe("renders without crashing, after room has been created", () => {
    const wrapper = applyMount(["start"]);
    it("admin should see the start button and press it", () => {
      const startButton = wrapper.find(".votes-blue");
      expect(startButton.exists()).toEqual(true);
      startButton.simulate("click", { preventDefault() {} });
      expect(mockStartStory.mock.calls.length).toBe(1);
    });
  });

  describe("after start button", () => {
    it("should display 4 buttons: Flip Cards, Clear Votes, Reset Timer, Next Story", () => {
      const wrapper = applyMount(["flip", "clear", "reset", "next"]);
      const controls = wrapper.find(".votes-option");
      expect(controls).toHaveLength(4);
    });
  });

  describe("after start button has been clicked, some delay exists while data is fetching", () => {
    it("Start button text should be Starting", () => {
      const wrapper = applyMount(["start"]).setProps({
        status: true
      });
      const startButton = wrapper.find(".startgame-control");
      expect(startButton.text()).toBe("Starting...");
    });
  });

  describe("admin presses Flip Cards button", () => {
    it("should display instead Finish Voting button as an option", () => {
      const wrapper = applyMount(["end", "reset", "next", "clear"]);

      const control = wrapper.find(".votes-blue");
      expect(control.text()).toEqual("Finish Voting");
    });
  });

  describe("admin presses Clear Votes button", () => {
    it("should display Flip Cards again as an option", () => {
      const wrapper = applyMount(["flip", "clear", "reset", "next"]);
      const control = wrapper.find("button").map(node => node.text());
      expect(control.includes("Flip Cards")).toBeTruthy();
    });
  });

  describe("admin presses Reset Timer button", () => {
    it("should call stopTimer first and then resetTimer func", () => {
      const wrapper = applyMount(["flip", "clear", "reset", "next"]);
      const control = wrapper.find(".controls").childAt(2);
      control.simulate("click", { preventDefault() {} });
      expect(mockResetTimer).toBeCalled();
    });
  });

  describe("after Flip Cards button, admin now presses Finish Voting button", () => {
    it("should call endCurrentGame & stopTimer functions and let only Clear Votes & Next Story buttons as options", () => {
      const wrapper = applyMount(["end", "reset", "next", "clear"]);
      const finish = wrapper.find(".controls").childAt(0);
      finish.simulate("click", { preventDefault() {} });

      expect(mockEndStory).toBeCalled();
      wrapper.setProps({
        shows: ["clear", "next"]
      });
      const controls = wrapper.find(".votes-option");
      expect(controls).toHaveLength(2);
    });
  });

  describe("admin now changes his mind, and after the game has finished, presses Clear Votes", () => {
    it("should see all 4 option button that he had at the start of the game", () => {
      const wrapper = applyMount(["clear", "next"]);
      const control = wrapper.find(".controls").childAt(0);
      control.simulate("click", { preventDefault() {} });
      expect(mockDeleteVotes).toBeCalled();
    });
  });
});
