import React from "react";
import { mount, shallow } from "enzyme";
import StoryDescription from "./storyDescription";
import { Modal } from "../modals";

describe("Story Description Component", () => {
  const stories = {
    nextStoryId: 1,
    stories: [
      { story: "testTitle", completed: false, id: 1 },
      { story: "pomelo", completed: false, id: 2 }
    ],
    activeStory: { id: 1, text: "testTitle" }
  };

  const mockDeleteFunc = jest.fn();
  it("renders without crashing", () => {
    mount(
      <table>
        <tbody>
          {stories.stories.map(e => (
            <StoryDescription
              key={e.id}
              story={e.story}
              id={e.id}
              activeStoryId={stories.activeStory.id}
              deleteStory={mockDeleteFunc}
            />
          ))}
        </tbody>
      </table>
    );
  });

  describe("admin clicks the title of a active story already created, found in table", () => {
    it("should render a modal with details, allowing modifying of story title", () => {
      const wrapper = shallow(
        <StoryDescription
          key={stories.stories[0].id}
          story={stories.stories[0].story}
          id={stories.stories[0].id}
          activeStoryId={stories.activeStory.id}
          deleteStory={mockDeleteFunc}
        />
      );
      const storyDetailBtn = wrapper.find("tr").childAt(0);
      storyDetailBtn.simulate("click", { preventDefault() {} });
      expect(
        wrapper
          .find(Modal)
          .childAt(0)
          .prop("story")
      ).toEqual("testTitle");
    });
  });

  describe("admin clicks delete story button from a title, except current active title which hasn't one", () => {
    it("should render an alert with a message before delete action", () => {
      const mockDeleteConfirm = jest.fn(() => true);
      const wrapper = shallow(
        <StoryDescription
          key={stories.stories[1].id}
          story={stories.stories[1].story}
          id={stories.stories[1].id}
          activeStoryId={stories.activeStory.id}
          deleteStory={mockDeleteConfirm}
        />
      );
      const storyDeleteBtn = wrapper
        .find("tr")
        .childAt(1)
        .childAt(0);
      storyDeleteBtn.simulate("click", { preventDefault() {} });
      expect(mockDeleteConfirm).toBeCalled();
    });
  });
});
