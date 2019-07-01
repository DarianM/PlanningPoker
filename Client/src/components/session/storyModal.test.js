import React from "react";
import { mount } from "enzyme";
import { ConnectedStory } from "./storyModal";
import { Modal } from "../modals";

describe("Story Modal", () => {
  const mockCloseModal = jest.fn();
  let newText;
  const mockEditStory = changeData => {
    newText = changeData.value;
  };
  const applyMount = () => {
    mount(
      <Modal>
        <ConnectedStory
          story="text"
          id={1}
          roomId={1}
          close={mockCloseModal}
          editStory={mockEditStory}
        >
          <p>...some story text</p>
        </ConnectedStory>
      </Modal>
    );
  };
  describe("renders without crashing", () => {
    it("should render a modal with story title as default value in an input", () => {
      const wrapper = applyMount();
      expect(wrapper.find(".story-detail-input").props().defaultValue).toEqual(
        "text"
      );
    });
  });

  describe("user clicks save button after modifying the value", () => {
    it("should commit to the store with the new value", async () => {
      // let newText;
      const mockSaveFunc = changeData => {
        newText = changeData.value;
      };
      const wrapper = applyMount();

      const input = wrapper.find(".story-detail-input");
      const saveButton = wrapper.find(".votes-blue");
      input.simulate("change", { target: { value: "new title for story" } });
      await saveButton.simulate("click", { preventDefault() {} });

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
            roomId={1}
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
