import React from "react";
import { mount } from "enzyme";
import LoginModal from "./loginModal";

const mockCreateRoom = jest.fn();
const mockCancel = jest.fn();
const applyMount = () => {
  return mount(<LoginModal create={mockCreateRoom} cancel={mockCancel} />);
};

describe("room name form is displayed", () => {
  describe("create button is pressed", () => {
    describe("with a valid room name", () => {
      it("should create a new room", () => {
        const wrapper = applyMount();
        wrapper
          .find(".modal-footer")
          .childAt(0)
          .simulate("click", { preventDefault() {} });
        expect(mockCreateRoom).toHaveBeenCalled();
      });
    });

    describe("with a invalid room name", () => {
      it("should display error message", () => {
        const wrapper = applyMount();
        wrapper.instance().input.current.value =
          "some_long_ass_title_with_many_many_chars..";
        wrapper
          .find(".modal-footer")
          .childAt(0)
          .simulate("click", { preventDefault() {} });
        expect(wrapper.find(".loginError").exists()).toBe(true);
      });
    });
  });
});
