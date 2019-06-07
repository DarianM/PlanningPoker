import React from "react";
import { mount } from "enzyme";
import { ConnectedSessionInfo } from "./sessionInfo";

const renameStoryMock = jest.fn();
const renameRoomMock = jest.fn();
const applyMount = () => {
  return mount(
    <ConnectedSessionInfo
      roomId={1}
      roomName="name"
      activeStory={{}}
      renameStory={renameStoryMock}
      renameRoom={renameRoomMock}
    />
  );
};

describe("Sessioninfo Component", () => {
  it("renders without crashing", () => {
    applyMount();
  });

  describe("after room is created & admin joined, active story is undefined", () => {
    const infoComponent = applyMount();
    it("should render only room ID", () => {
      expect(infoComponent.find(".sessionRoomId").text()).toEqual(
        "your room ID: 1"
      );
    });
    describe("after admin enters first story of the game", () => {
      it("should display first story as current active story", () => {
        infoComponent.setProps({
          activeStory: { text: "testStory", id: 1 }
        });
        expect(
          infoComponent
            .find(".activestory")
            .at(1)
            .text()
        ).toEqual("testStory");
      });
    });
  });
});
