import React from "react";
import { shallow } from "enzyme";
import { ConnectedLogin } from "./login";

let connection = { isFetching: false, error: "" };
const applyShallow = mock => {
  return shallow(
    <ConnectedLogin createRoom={mock} joinRoom={mock} connection={connection} />
  );
};

describe("Login Component", () => {
  it("renders without crashing", () => {
    const mockLoginFunc = jest.fn();
    applyShallow(mockLoginFunc);
  });

  describe("when start a session button is clicked", () => {
    it("should call the mock login function", () => {
      const mockOnClick = jest.fn();
      const wrapper = applyShallow(mockOnClick);
      wrapper.setState({
        user: "name",
        roomName: "RIP_Grumpy_Cat"
      });
      wrapper.find("#startSession").simulate("click", { preventDefault() {} });
      expect(mockOnClick.mock.calls.length).toBe(1);
      expect(mockOnClick.mock.calls[0][0].roomName).toEqual("RIP_Grumpy_Cat");
    });
  });

  describe("when pressing start a session button some data is being fetched", () => {
    connection = { ...connection, isFetching: true };
    it("button text should be Processing...", () => {
      const mockLoginFunc = jest.fn();
      const wrapper = applyShallow(mockLoginFunc);
      const startSessionBtn = wrapper
        .find("#startSession")
        .simulate("click", { preventDefault() {} });
      expect(startSessionBtn.text()).toBe("Processing...");
    });
  });

  describe("when join session button is clicked", () => {
    it("should call the mock login function", () => {
      const mockOnClick = jest.fn();
      const wrapper = applyShallow(mockOnClick);
      wrapper.find("#joinSession").simulate("click", { preventDefault() {} });

      expect(mockOnClick.mock.calls.length).toBe(1);
    });
  });

  describe("when pressing join session button some data is being fetched", () => {
    connection = { ...connection, isFetching: true };
    it("button text should be Processing...", () => {
      const mockLoginFunc = jest.fn();
      const wrapper = applyShallow(mockLoginFunc);
      const joinSessionBtn = wrapper
        .find("#joinSession")
        .simulate("click", { preventDefault() {} });
      expect(joinSessionBtn.text()).toBe("Processing...");
    });
  });

  describe("after pressing join session button some error data might arrive ", () => {
    connection = { isFetching: true, error: "Room is not available" };
    it("error message should be displayed at the bottom", () => {
      const mockLoginFunc = jest.fn();
      const wrapper = applyShallow(mockLoginFunc);
      const errorMessage = wrapper.find(".loginError");
      expect(errorMessage.text()).toBe("Room is not available");
    });
  });
});
