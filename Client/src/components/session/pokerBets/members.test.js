import React from "react";
import { mount } from "enzyme";
import Members from "./members";

describe("Members Component", () => {
  const members = [
    { member: "Joe", voted: false, id: 1 },
    { member: "newUser", voted: true, id: 2 }
  ];
  it("renders members correctly & without crashing", () => {
    const wrapper = mount(<Members members={members} votes={{}} />);

    expect(wrapper.find(".members").children()).toHaveLength(members.length);
  });
  describe("vote state of each logged member", () => {
    it("should display user name for each member", () => {
      const wrapper = mount(<Members members={members} votes={{}} />);

      const names = wrapper.find("#name").map(node => node.text());
      expect(names).toEqual(["Joe", "newUser"]);
    });

    describe("player has picked a card", () => {
      it("should display a message alongside members who voted", () => {
        const wrapper = mount(<Members members={members} votes={{}} />);

        const voted = wrapper.find("#voted-state").map(node => node.text());
        expect(voted.includes("Voted!")).toBeTruthy();
      });
    });

    describe("votes are flipped over", () => {
      const wrapper = mount(<Members members={members} votes={{}} />);

      wrapper.setProps({
        votes: {
          list: [{ user: "newUser", voted: "1/3", id: 1 }],
          flip: true
        }
      });
      it("should display actual vote for each member", () => {
        const vote = wrapper.find("#vote").map(node => node.text());
        expect(vote.includes("1/3")).toBeTruthy();
      });
    });

    describe("some members didn't vote ,but cards are flipped over", () => {
      it("should display a ? char next to those who didn't vote", () => {
        const wrapper = mount(<Members members={members} votes={{}} />);
        wrapper.setProps({
          votes: {
            list: [{ user: "newUser", voted: "1/3", id: 1 }],
            flip: true
          }
        });

        const vote = wrapper.find("#vote").map(node => node.text());
        expect(vote.includes("?")).toBeTruthy();
      });
    });
  });
});
