import React from "react";
import { mount } from "enzyme";
import { ConnectedStories } from "./stories";

describe("Sessioninfo Component", () => {
  const stories = {
    byId: {
      1: { id: 1, text: "test" }
    },
    allIds: [1],
    activeStoryId: 1
  };

  const mockNewStory = jest.fn();
  const mockDeleteStory = jest.fn();
  it("renders without crashing", () => {
    mount(
      <ConnectedStories
        stories={stories}
        newStory={mockNewStory}
        deleteStory={mockDeleteStory}
      />
    );
  });

  describe("admin wants to create a new story and presses +New", () => {
    it("should render a modal", () => {
      const wrapper = mount(
        <ConnectedStories
          stories={stories}
          newStory={mockNewStory}
          deleteStory={mockDeleteStory}
        />
      );
      const newStoryBtn = wrapper.find(".new_btn");
      newStoryBtn.simulate("click");
      expect(wrapper.find(".modal-header").text()).toEqual("Create New Story");
    });
  });
});
