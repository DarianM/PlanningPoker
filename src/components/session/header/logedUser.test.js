import React from "react";
import { shallow, mount } from "enzyme";
import LogedUser from "./logedUser";

describe("LogedUser Component", () => {
  it("renders without crashing", () => {
    shallow(<LogedUser name="testName" />);
  });
  describe("after player has loged", () => {
    it("should display correct username", () => {
      expect(
        mount(<LogedUser name="testName" />)
          .find("#userLoged")
          .text()
      ).toEqual("User: testName");
    });
  });
});
