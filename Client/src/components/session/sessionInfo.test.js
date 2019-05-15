import React from "react";
import { mount } from "enzyme";
import { ConnectedSessionInfo } from "./sessionInfo";

describe("Sessioninfo Component", () => {
  it("renders without crashing", () => {
    const mockFunc = jest.fn();
    mount(
      <ConnectedSessionInfo
        roomId={-1}
        roomName="name"
        roomHistory={{}}
        editStory={mockFunc}
      />
    );
  });

  describe("after room is created & admin joined, active story is undefined", () => {
    const mockFunc = jest.fn();
    const props = {
      roomHistory: {
        activeStory: ""
      },
      roomId: -1,
      editStory: mockFunc
    };
    const infoComponent = mount(<ConnectedSessionInfo {...props} />);
    it("should render only room ID", () => {
      expect(infoComponent.find(".sessionRoomId").text()).toEqual(
        "your room ID:-1"
      );
    });
    describe("after admin enters first story of the game", () => {
      it("should display first story as current active story", () => {
        infoComponent.setProps({
          roomHistory: { activeStory: { text: "testStory", id: 1 } }
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
