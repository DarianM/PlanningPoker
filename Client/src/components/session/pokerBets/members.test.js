import React from "react";
import { mount } from "enzyme";
import { ConnectedMembers } from "./members";

const members = [
  { member: "Joe", voted: false, id: 1 },
  { member: "newUser", voted: true, id: 2 }
];
const applyMount = () => {
  return mount(
    <ConnectedMembers members={members} activeStory={{}} flip={false} />
  );
};

describe("Members Component", () => {
  it("renders members correctly & without crashing", () => {
    const wrapper = applyMount();

    expect(wrapper.find(".members").children()).toHaveLength(members.length);
  });
  describe("vote state of each logged member", () => {
    it("should display user name for each member", () => {
      const wrapper = applyMount();

      const names = wrapper.find("#name").map(node => node.text());
      expect(names).toEqual(["Joe", "newUser"]);
    });

    describe("player has picked a card", () => {
      it("should display a message alongside members who voted", () => {
        const wrapper = applyMount();

        const voted = wrapper.find("#voted-state").map(node => node.text());
        expect(voted.includes("Voted!")).toBeTruthy();
      });
    });

    describe("votes are flipped over", () => {
      it("should display actual vote for each member", () => {
        const wrapper = applyMount();

        wrapper.setProps({
          flip: true,
          activeStory: { votes: [{ name: "newUser", id: 2, vote: 3 }] }
        });
        const vote = wrapper.find("#vote").map(node => node.text());
        expect(vote.includes("3")).toBeTruthy();
      });
    });

    describe("some members didn't vote ,but cards are flipped over", () => {
      it("should display a ? char next to those who didn't vote", () => {
        const wrapper = applyMount();
        wrapper.setProps({
          flip: true,
          activeStory: { votes: [{ name: "newUser", id: 2, vote: 3 }] }
        });

        const vote = wrapper.find("#vote").map(node => node.text());
        expect(vote.includes("?")).toBeTruthy();
      });
    });
  });
});
