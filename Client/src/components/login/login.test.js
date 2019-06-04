import React from "react";
import { mount } from "enzyme";
import { ConnectedLogin } from "./login";

const connection = { isLoading: false, error: "" };
const mockCreateRoom = jest.fn();
const mockJoinRoom = jest.fn();
const applyMount = hash => {
  return mount(
    <ConnectedLogin
      createRoom={mockCreateRoom}
      joinRoom={mockJoinRoom}
      connection={connection}
      hash={hash}
    />
  );
};

describe("Login Component", () => {
  it("renders without crashing", () => {
    const hash = "/#14";
    applyMount(hash);
  });

  describe("creating a new room", () => {
    describe("start a session button is clicked", () => {
      describe("with valid user name", () => {
        const hash = "";
        it("should display enter room name form", () => {
          const wrapper = applyMount(hash);
          wrapper.instance().user.current.value = "name";
          wrapper
            .find(".enter-button")
            .simulate("click", { preventDefault() {} });
          expect(wrapper.state().show).toBe(true);
          expect(wrapper.find(".log-modal-input").exists()).toBe(true);
        });
      });

      describe("with invalid user name", () => {
        const hash = "";
        it("should display error message", () => {
          const wrapper = applyMount(hash);
          wrapper.instance().user.current.value = "why_are_you_doing_this";

          wrapper
            .find(".enter-button")
            .simulate("click", { preventDefault() {} });
          expect(wrapper.state().error).toEqual(
            "Please enter no more than 10 characters"
          );
          expect(wrapper.find(".loginError").exists()).toBe(true);
        });
      });
    });
  });

  describe("joining a room", () => {
    const hash = "/#1";
    describe("when start a session button is clicked some data is beeing fetched", () => {
      it("button text should be Processing...", () => {
        const wrapper = applyMount(hash);
        wrapper.setProps({ connection: { isLoading: true, error: "" } });
        expect(wrapper.find(".enter-button").text()).toEqual("Processing...");
      });
      it("should join a created room", () => {
        const wrapper = applyMount(hash);
        wrapper.instance().user.current.value = "valid";
        wrapper
          .find(".enter-button")
          .simulate("click", { preventDefault() {} });
        expect(mockJoinRoom).toHaveBeenCalled();
      });
    });
  });
});
