import React from "react";
import { mount } from "enzyme";
import { ConnectedStory } from "./storyModal";
import { Modal } from "../modals";

describe("Story Modal", () => {
  const mockCloseModal = jest.fn();
  const mockEditStory = jest.fn();
  describe("renders without crashing", () => {
    it("should render a modal with story title as default value in an input", () => {
      const wrapper = mount(
        <Modal>
          <ConnectedStory
            story="text"
            id={1}
            close={mockCloseModal}
            editStory={mockEditStory}
          >
            <p>...some story text</p>
          </ConnectedStory>
        </Modal>
      );
      expect(
        wrapper
          .find(ConnectedStory)
          .childAt(1)
          .childAt(1)
          .props().defaultValue
      ).toEqual("text");
    });
  });

  describe("user clicks save button after modifying the value", () => {
    it("should commit to the store with the new value", () => {
      let newText;
      const mockSaveFunc = changeData => {
        newText = changeData.value;
      };
      const wrapper = mount(
        <Modal>
          <ConnectedStory
            story="text"
            id={1}
            close={mockCloseModal}
            editStory={mockSaveFunc}
          >
            <p>...some story text</p>
          </ConnectedStory>
        </Modal>
      );

      const input = wrapper
        .find(ConnectedStory)
        .childAt(1)
        .childAt(1);
      const saveButton = wrapper.find(".votes-blue");
      input.simulate("change", { target: { value: "new title for story" } });
      saveButton.simulate("click", { preventDefault() {} });

      expect(newText).toBe("new title for story");
    });
  });

  describe("user clicks x button", () => {
    it("should dismiss the modal", () => {
      const wrapper = mount(
        <Modal>
          <ConnectedStory
            story="text"
            id={1}
            close={mockCloseModal}
            editStory={mockEditStory}
          >
            <p>...some story text</p>
          </ConnectedStory>
        </Modal>
      );
      const closeBtn = wrapper
        .find(ConnectedStory)
        .childAt(0)
        .find("span");
      closeBtn.simulate("click", { preventDefault() {} });
      expect(mockCloseModal).toBeCalled();
    });
  });
});
