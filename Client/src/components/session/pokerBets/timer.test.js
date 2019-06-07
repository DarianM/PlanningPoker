import React from "react";
import { shallow } from "enzyme";
import { ConnectedTimer } from "./timer";

const activeStory = { id: 1, text: "test", start: null, end: null, votes: [] };

const applyShallow = () => {
  return shallow(<ConnectedTimer activeStory={activeStory} />);
};

describe("Timer component", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => new Date("2019-04-09T11:05:20").valueOf());
  });

  afterAll(() => {
    jest.useRealTimers();
    Date.now = global.Date.now();
  });

  it("renders without crashing, after room has been created", () => {
    applyShallow();
  });

  describe("game isn't started so timer shouldn't start", () => {
    it("should display 00:00", () => {
      const wrapper = applyShallow();
      jest.advanceTimersByTime(5000);
      expect(wrapper.find(".timer").text()).toEqual("00:00");
    });
  });

  describe("admin did press Start button and 10s have passed since then", () => {
    it("should display 00:10", () => {
      const wrapper = applyShallow();
      wrapper.setProps({
        activeStory: { start: new Date("2019-04-09T11:05:10") }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:10");
    });
  });

  describe("after 30s, timer 00:30, Reset Timer is pressed", () => {
    it("should display timer at 00:00", () => {
      const wrapper = applyShallow();
      wrapper.setProps({
        activeStory: { start: new Date("2019-04-09T11:04:50") }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:30");

      wrapper.setProps({
        activeStory: { start: new Date("2019-04-09T11:05:20"), end: null }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:00");
    });
  });

  describe("Finish Voting is pressed so game has ended", () => {
    it("should stop timer displaying last value bofore button click", () => {
      const wrapper = applyShallow();
      wrapper.setProps({
        activeStory: { start: new Date("2019-04-09T11:05:07") }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("00:13");

      wrapper.setProps({
        activeStory: { end: new Date("2019-04-09T11:05:07") }
      });
      expect(wrapper.find(".timer").text()).toEqual("00:13");
    });
  });

  describe("admin changes his mind after finishing current game and has the Clear Votes button option as a backup", () => {
    it("should restart the timer where it left, plus the time passed since admin ended game", () => {
      const wrapper = applyShallow();
      wrapper.setProps({
        activeStory: {
          start: new Date("2019-04-09T11:02:00"),
          end: new Date("2019-04-09T11:05:20")
        }
      });
      jest.advanceTimersByTime(1000);
      expect(wrapper.find(".timer").text()).toEqual("03:20");
      wrapper.setProps({
        activeStory: { start: new Date("2019-04-09T11:02:00"), end: null }
      });
      Date.now = jest.fn(() => new Date("2019-04-09T11:05:40").valueOf());

      jest.advanceTimersByTime(20000);
      expect(wrapper.find(".timer").text()).toEqual("03:40");
    });
  });
});
