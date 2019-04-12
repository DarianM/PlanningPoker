import React from "react";
import { mount } from "enzyme";
import { ConnectedGameControls } from "./gameControls";

describe("Poker results Component", () => {
  const start = null;
  const gameVotes = { end: null, flip: false };
  const mockStartGame = jest.fn();
  const mockFlipCards = jest.fn();
  const mockDeleteVotes = jest.fn();
  const mockEndGame = jest.fn();
  const mockResetTimer = jest.fn();
  const mockStopTimer = jest.fn();
  const mockStartTimer = jest.fn();

  describe("renders without crashing, after room has been created", () => {
    const wrapper = mount(
      <ConnectedGameControls
        startGame={start}
        results={gameVotes}
        startCurrentGame={mockStartGame}
        flipCards={mockFlipCards}
        deleteVotes={mockDeleteVotes}
        endCurrentGame={mockEndGame}
        resetTimer={mockResetTimer}
        stopTimer={mockStopTimer}
        startTimer={mockStartTimer}
      />
    );
    it("admin should see the start button and press it", () => {
      const startButton = wrapper.find(".votes-blue");
      expect(startButton.exists()).toEqual(true);
      startButton.simulate("click", { preventDefault() {} });
      expect(mockStartGame.mock.calls.length).toBe(1);
    });
  });

  describe("after start button", () => {
    it("should display 4 buttons: Flip Cards, Clear Votes, Reset Timer, Next Story", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({ startGame: new Date() });
      const controls = wrapper.find(".votes-option");
      expect(controls).toHaveLength(4);
    });
  });

  describe("admin presses Flip Cards button", () => {
    it("should display instead Finish Voting button as an option", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({ startGame: new Date(), results: { flip: true } });
      const control = wrapper.find(".votes-blue");
      expect(control.text()).toEqual("Finish Voting");
    });
  });

  describe("admin presses Clear Votes button", () => {
    it("should display Flip Cards again as an option", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({ startGame: new Date(), results: { flip: false } });
      const control = wrapper.find("button").map(node => node.text());
      expect(control.includes("Flip Cards")).toBeTruthy();
    });
  });

  describe("admin presses Reset Timer button", () => {
    it("should call stopTimer first and then resetTimer func", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({ startGame: new Date() });
      const control = wrapper.find(".controls").childAt(2);
      control.simulate("click", { preventDefault() {} });
      expect(mockStopTimer).toBeCalled();
      expect(mockResetTimer).toBeCalled();
    });
  });

  describe("after Flip Cards button, admin now presses Finish Voting button", () => {
    it("should call endCurrentGame & stopTimer functions and let only Clear Votes & Next Story buttons as options", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({ startGame: new Date(), results: { flip: true } });
      const finish = wrapper.find(".controls").childAt(0);
      finish.simulate("click", { preventDefault() {} });

      expect(mockEndGame).toBeCalled();
      expect(mockStopTimer).toBeCalled();
      wrapper.setProps({
        startGame: new Date(),
        results: { flip: true, end: new Date() }
      });
      const controls = wrapper.find(".votes-option");
      expect(controls).toHaveLength(2);
    });
  });

  describe("admin now changes his mind, and after the game has finished, presses Clear Votes", () => {
    it("should see all 4 option button that he had at the start of the game", () => {
      const wrapper = mount(
        <ConnectedGameControls
          startGame={start}
          results={gameVotes}
          startCurrentGame={mockStartGame}
          flipCards={mockFlipCards}
          deleteVotes={mockDeleteVotes}
          endCurrentGame={mockEndGame}
          resetTimer={mockResetTimer}
          stopTimer={mockStopTimer}
          startTimer={mockStartTimer}
        />
      ).setProps({
        startGame: new Date(),
        results: { flip: true, end: new Date() }
      });
      const control = wrapper.find(".controls").childAt(0);
      control.simulate("click", { preventDefault() {} });
      expect(mockDeleteVotes).toBeCalled();
    });
  });
});
