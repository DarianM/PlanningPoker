import React from "react";
import { mount, shallow } from "enzyme";
import EditableText from "./editableText";

describe("EditableText Component", () => {
  describe("renders without crashing", () => {
    const save = jest.fn();
    const component = mount(<EditableText text="test" commit={save} />);
    it("should display text by default", () => {
      expect(component.find(".activestory").text()).toEqual("test");
    });
  });

  describe("user clicks on text to modify it", () => {
    const mockSaveFunc = jest.fn();
    const wrapper = shallow(<EditableText text="test" commit={mockSaveFunc} />);
    let text = wrapper.find(".activestory");
    text.simulate("click", { preventDefault() {} });

    text = wrapper.find(".activestory-input");
    it("should enter edit mode, input with text as default value & save button", () => {
      expect(text.props().defaultValue).toEqual("test");
    });
  });
});

describe("user clicks save button after modifying the value", () => {
  it("should commit to the store with the new value", () => {
    let newText;
    const mockSaveFunc = changeData => {
      newText = changeData.value;
    };
    const wrapper = shallow(<EditableText text="test" commit={mockSaveFunc} />);
    wrapper.setState({ edit: true });

    const input = wrapper.find(".activestory-input");
    const saveButton = wrapper.find(".editable-submit");
    input.simulate("change", { target: { value: "new text" } });
    saveButton.simulate("click", { preventDefault() {} });

    expect(newText).toBe("new text");
  });
});
