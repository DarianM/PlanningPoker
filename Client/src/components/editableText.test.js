import React from "react";
import { mount } from "enzyme";
import EditableText from "./editableText";

describe("EditableText Component", () => {
  describe("renders without crashing", () => {
    const save = jest.fn();
    const validation = jest.fn();
    const component = mount(
      <EditableText text="test" commit={save} validation={validation} />
    );
    it("should display text by default", () => {
      expect(component.find(".activetext-edit").text()).toEqual("test");
    });
  });

  describe("user clicks on text to modify it", () => {
    const mockSaveFunc = jest.fn();
    const mockValidation = jest.fn();
    const wrapper = mount(
      <EditableText
        text="test"
        commit={mockSaveFunc}
        validation={mockValidation}
      />
    );
    let text = wrapper.find(".activetext-edit");
    text.simulate("click", { preventDefault() {} });

    text = wrapper.find(".activestory-input");
    it("should enter edit mode, input with text as default value & save button", () => {
      expect(text.props().defaultValue).toEqual("test");
    });
  });
});

describe("user clicks save button after modifying the value", () => {
  it("should commit to the store with the new value", async () => {
    let newText;
    const mockSaveFunc = changeData => {
      newText = changeData.value;
    };
    const mockValidation = () =>
      new Promise((resolve, reject) => resolve(true));

    const wrapper = mount(
      <EditableText
        text="test"
        commit={mockSaveFunc}
        validation={mockValidation}
      />
    );
    wrapper.setState({ edit: true });

    const input = wrapper.find(".activestory-input");
    const saveButton = wrapper.find(".editable-submit");
    input.simulate("change", { target: { value: "new text" } });
    await saveButton.simulate("submit", { preventDefault() {} });

    expect(newText).toBe("new text");
  });
});
