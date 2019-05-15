import React from "react";
import { shallow } from "enzyme";
import { ConnectedLogin } from "./login";

const applyShallow = mock => {
  const connection = { isFetching: false, error: "" };
  return shallow(
    <ConnectedLogin
      _createRoom={mock}
      _joinRoom={mock}
      connection={connection}
    />
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
      wrapper.find("#startSession").simulate("click", { preventDefault() {} });

      expect(mockOnClick.mock.calls.length).toBe(1);
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
});
