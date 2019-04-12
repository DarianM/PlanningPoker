import React from "react";
import { shallow } from "enzyme";
import PokerBets from "./pokerBets";

describe("Poker results Component", () => {
  const gameRoom = {
    members: [
      { member: "Joe", voted: false, id: 1 },
      { member: "newUser", voted: true, id: 2 }
    ],
    gameStart: null
  };
  const gameVotes = {
    end: null,
    flip: false,
    list: [{ user: "testUser", voted: "1/3", id: 1 }]
  };
  const chat = {
    messages: [
      { message: "testMsg", user: "testUser", id: 1 },
      { message: "voted", user: "testUser", id: 2 }
    ]
  };

  beforeAll(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => new Date("2019-04-09T11:05:20").valueOf());
  });

  afterAll(() => {
    jest.useRealTimers();
    Date.now = global.Date.now();
  });

  it("renders without crashing, after room has been created", () => {
    shallow(<PokerBets stats={gameRoom} results={gameVotes} log={chat} />);
  });

  describe("admin didn't press Start so timer shouldn't start", () => {
    it("should display 00:00", () => {
      const wrapper = shallow(
        <PokerBets stats={gameRoom} results={gameVotes} log={chat} />
      );
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(5000);
      expect(wrapper.find(".timer").text()).toEqual("00:00");
    });
  });

  describe("admin did press Start button and 10s have passed since then", () => {
    it("should display 00:10", () => {
      const wrapper = shallow(
        <PokerBets stats={gameRoom} results={gameVotes} log={chat} />
      );
      wrapper.setProps({
        stats: {
          gameStart: new Date("2019-04-09T11:05:10"),
          members: gameRoom.members
        }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:10");
    });
  });

  describe("after 30s, timer 00:30, Reset Timer is pressed", () => {
    it("should display timer at 00:00", () => {
      const wrapper = shallow(
        <PokerBets stats={gameRoom} results={gameVotes} log={chat} />
      );
      wrapper.setProps({
        stats: {
          gameStart: new Date("2019-04-09T11:04:50"),
          members: gameRoom.members
        }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:30");

      wrapper.instance().stopTimer();
      wrapper.setProps({
        stats: { gameStart: new Date("2019-04-09T11:05:20") }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:00");
    });
  });

  describe("Finish Voting is pressed so game has ended", () => {
    it("should stop timer displaying last value bofore button click", () => {
      const wrapper = shallow(
        <PokerBets stats={gameRoom} results={gameVotes} log={chat} />
      );
      wrapper.setProps({
        stats: { gameStart: new Date("2019-04-09T11:05:07") }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:13");
      wrapper.instance().stopTimer();

      wrapper.setProps({
        stats: {
          gameStart: new Date("2018-01-09T11:05:20"),
          members: gameRoom.members
        }
      });
      expect(wrapper.find(".timer").text()).toEqual("00:13");
    });
  });

  describe("admin changes his mind after finishing current game and has the Clear Votes button option as a backup", () => {
    it("should restart the timer where it left, plus the time passed since admin ended game", () => {
      const wrapper = shallow(
        <PokerBets stats={gameRoom} results={gameVotes} log={chat} />
      );
      wrapper.setProps({
        stats: {
          gameStart: new Date("2019-04-09T11:02:00"),
          members: gameRoom.members
        }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("03:20");
      wrapper.instance().stopTimer();

      wrapper.setProps({
        stats: {
          gameStart: new Date("2019-04-09T11:01:45"),
          members: gameRoom.members
        }
      });
      wrapper.instance().startTimer();
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("03:35");
    });
  });
});
