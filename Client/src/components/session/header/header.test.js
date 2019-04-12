import React from "react";
import { shallow } from "enzyme";
import Header from "./header";

describe("LogedUser Component", () => {
  it("renders without crashing", () => {
    shallow(<Header head="testName" />);
  });
});
