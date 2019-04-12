import React from "react";
import { mount } from "enzyme";
import StatusMessage from "./statusMessage";

describe("Game status Component", () => {
  const members = [
    { member: "Joe", voted: false, id: 1 },
    { member: "newUser", voted: true, id: 2 }
  ];

  describe("renders correctly & without crashing", () => {
    const component = mount(
      <StatusMessage start={null} end={null} flip={false} members={members} />
    );
    it("should render a message by default after game has started", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Press Start to begin"
      );
    });
  });

  describe("Admin clicks start button", () => {
    const component = mount(
      <StatusMessage start={null} end={null} flip={false} members={members} />
    );

    component.setProps({ start: new Date() });
    it("should display a message with each member who didn't vote yet, in alphabetical order", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Waiting for Joe to vote"
      );
    });
  });

  describe("all members voted or admin forced flip of votes", () => {
    const component = mount(
      <StatusMessage
        start={new Date()}
        end={null}
        flip={false}
        members={members}
      />
    );
    component.setProps({ flip: true });
    it("should display a message for this case as well", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Waiting for moderator to finalise"
      );
    });
  });

  describe("admin decided to end current game round", () => {
    const component = mount(
      <StatusMessage
        start={new Date()}
        end={null}
        flip={false}
        members={members}
      />
    );
    component.setProps({ flip: true, end: new Date() });
    it("shows a final message that this round has come to an end", () => {
      expect(component.find(".results-header").text()).toEqual(
        "Story voting completed"
      );
    });
  });
});
