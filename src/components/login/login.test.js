import React from "react";
import { shallow } from "enzyme";
import { ConnectedLogin } from "./login";

describe("Login Component", () => {
  const mockLoginFunc = jest.fn();
  it("renders without crashing", () => {
    shallow(<ConnectedLogin login={mockLoginFunc} />);
  });

  describe("when start a session button is clicked", () => {
    it("should call the mock login function", () => {
      const mockOnClick = jest.fn();
      const wrapper = shallow(<ConnectedLogin login={mockOnClick} />);
      wrapper.find("#startSession").simulate("click", { preventDefault() {} });

      expect(mockOnClick.mock.calls.length).toBe(1);
    });
  });
});
