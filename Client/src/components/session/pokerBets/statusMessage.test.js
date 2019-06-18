import React from "react";
import { mount } from "enzyme";
import { ConnectedStatusMessage } from "./statusMessage";

const members = [
  { member: "Joe", voted: false, id: 1 },
  { member: "newUser", voted: true, id: 2 }
];
const applyMount = () => {
  return mount(
    <ConnectedStatusMessage
      members={members}
      start={false}
      end={false}
      flip={false}
    />
  );
};

describe("Game status Component", () => {
  describe("renders correctly & without crashing", () => {
    const component = applyMount();
    it("should render a message by default after game has started", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Press Start to begin"
      );
    });
  });

  describe("Admin clicks start button", () => {
    const component = applyMount();

    component.setProps({ start: true });
    it("should display a message with each member who didn't vote yet, in alphabetical order", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Waiting for Joe to vote"
      );
    });
  });

  describe("all members voted or admin forced flip of votes", () => {
    const component = applyMount();
    component.setProps({ start: true, flip: true });
    it("should display a message for this case as well", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Waiting for moderator to finalise"
      );
    });
  });

  describe("admin decided to end current game round", () => {
    const component = applyMount();
    component.setProps({ flip: true, start: true, end: true });
    it("shows a final message that this round has come to an end", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Story voting completed"
      );
    });
  });
});
