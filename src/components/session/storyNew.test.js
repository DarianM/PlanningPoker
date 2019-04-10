import React from "react";
import { mount } from "enzyme";
import NewStory from "./storyNew";
import { Modal } from "../modals";

describe("New Story Modal", () => {
  it("renders without crashing", () => {
    const mockAddStory = jest.fn();
    const mockMany = jest.fn();
    mount(
      <Modal>
        <NewStory addNewStory={mockAddStory} addMany={mockMany} />
      </Modal>
    );
  });

  describe("a textarea appears were admin can write stories", () => {
    it("should commit to the store with one story at a time", () => {
      let newText;
      const mockAddStoryFunc = changeData => {
        newText = changeData.new.story;
      };
      const mockMany = jest.fn();

      const wrapper = mount(
        <Modal>
          <NewStory addNewStory={mockAddStoryFunc} addMany={mockMany} />
        </Modal>
      );
      const textarea = wrapper
        .find(NewStory)
        .childAt(1)
        .childAt(0);
      const saveButton = wrapper
        .find(NewStory)
        .childAt(2)
        .childAt(1);
      textarea.simulate("change", { target: { value: "it's new" } });
      saveButton.simulate("click", { preventDefault() {} });

      expect(newText).toBe("it's new");
    });
  });

  describe("admin clicks Save And Add New button", () => {
    it("should allow admin to enter as many stories as he wants, without closing the modal", () => {
      let newText;
      const mockAddStoryFunc = changeData => {
        newText = changeData.new.story;
      };
      const mockMany = jest.fn();

      const wrapper = mount(
        <Modal>
          <NewStory addNewStory={mockAddStoryFunc} addMany={mockMany} />
        </Modal>
      );
      const textarea = wrapper
        .find(NewStory)
        .childAt(1)
        .childAt(0);
      const saveManyButton = wrapper
        .find(NewStory)
        .childAt(2)
        .childAt(0);
      textarea.simulate("change", {
        target: { value: "add as many as you want" }
      });
      saveManyButton.simulate("click", { preventDefault() {} });

      expect(newText).toBe("add as many as you want");
    });
  });
});
