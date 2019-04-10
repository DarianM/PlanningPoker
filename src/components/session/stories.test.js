import React from "react";
import { mount } from "enzyme";
import { ConnectedStories } from "./stories";

describe("Sessioninfo Component", () => {
  const stories = {
    nextStoryId: 1,
    stories: [{ story: "test", completed: false, id: 1 }],
    activeStory: ""
  };

  const mockAddStoryFunc = jest.fn();
  const mockDeleteFunc = jest.fn();
  it("renders without crashing", () => {
    mount(
      <ConnectedStories
        stories={stories}
        addStory={mockAddStoryFunc}
        deleteStory={mockDeleteFunc}
      />
    );
  });

  describe("admin wants to create a new story and presses +New", () => {
    it("should render a modal", () => {
      const wrapper = mount(
        <ConnectedStories
          stories={stories}
          addStory={mockAddStoryFunc}
          deleteStory={mockDeleteFunc}
        />
      );
      const newStoryBtn = wrapper.find(".new_btn");
      newStoryBtn.simulate("click");
      expect(wrapper.find(".modal-header").text()).toEqual("Create New Story");
    });
  });
});
