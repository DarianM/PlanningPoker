import React from "react";
import { mount, shallow } from "enzyme";
import StoryDescription from "./storyDescription";
import { Modal } from "../modals";

const stories = {
  byId: {
    1: { id: 1, text: "test" },
    2: { id: 2, text: "test-two" }
  },
  allIds: [1, 2],
  activeStoryId: 1
};

const mockDeleteStory = jest.fn();

const applyShallow = storyId => {
  const { id, text } = stories.byId[storyId];
  return shallow(
    <StoryDescription
      key={id}
      story={text}
      id={id}
      roomId={1}
      activeStoryId={stories.activeStoryId}
      deleteStory={mockDeleteStory}
    />
  );
};

describe("Story Description Component", () => {
  it("renders without crashing", () => {
    mount(
      <table>
        <tbody>
          {stories.allIds.map(id =>
            mount(
              <StoryDescription
                key={id}
                story={stories.byId[id].text}
                id={id}
                roomId={1}
                activeStoryId={stories.activeStoryId}
                deleteStory={mockDeleteStory}
              />
            )
          )}
        </tbody>
      </table>
    );
  });

  describe("admin clicks the title of a active story already created, found in table", () => {
    it("should render a modal with details, allowing modifying of story title", () => {
      const wrapper = applyShallow(1);
      const storyDetailBtn = wrapper
        .find("tr")
        .childAt(0)
        .childAt(0);
      storyDetailBtn.simulate("click", { preventDefault() {} });
      expect(
        wrapper
          .find(Modal)
          .childAt(0)
          .prop("story")
      ).toEqual("test");
    });
  });

  describe("admin clicks delete story button from a title, except current active title which hasn't one", () => {
    it("should render an alert with a message before delete action", () => {
      const mockDeleteConfirm = jest.fn(() => true);
      window.confirm = mockDeleteConfirm;
      const wrapper = applyShallow(2);
      const storyDeleteBtn = wrapper
        .find("tr")
        .childAt(1)
        .childAt(0);
      storyDeleteBtn.simulate("click", { preventDefault() {} });
      expect(mockDeleteConfirm).toBeCalled();
    });
  });
});
