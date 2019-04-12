import React from "react";
import { mount } from "enzyme";
import { ConnectedChat } from "./chat";

const messages = {
  messages: [
    { message: "testMsg", user: "testUser", id: 1 },
    { message: "voted", user: "testUser", id: 2 }
  ]
};

const name = "Dave";

describe("Chat Component", () => {
  const mockFunc = jest.fn();
  it("renders without crashing", () => {
    mount(
      <ConnectedChat chat={messages} user={name} addNewMessage={mockFunc} />
    );
  });
});
describe("user writes something in input and presses SendMessage", () => {
  it("should send the message", () => {
    let newMsg;
    const mockAddMessageFunc = changeData => {
      newMsg = changeData.message;
    };
    const wrapper = mount(
      <ConnectedChat
        chat={messages}
        user={name}
        addNewMessage={mockAddMessageFunc}
      />
    );
    const input = wrapper.find(".messageInput");
    const sendButton = wrapper.find(".sendMsg");
    input.simulate("change", { target: { value: "some text msg" } });
    sendButton.simulate("click", { preventDefault() {} });
    expect(newMsg).toEqual("some text msg");
  });
});
