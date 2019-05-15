import {
  connect,
  close,
  error,
  message,
  open,
  reconnected,
  reconnecting,
  send
} from "./websocketActions";
import {
  WEBSOCKET_CONNECT,
  WEBSOCKET_CLOSE,
  WEBSOCKET_OPEN,
  WEBSOCKET_ERROR,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_RECONNECTED,
  WEBSOCKET_RECONNECTING,
  WEBSOCKET_SEND
} from "./types";

describe("websocket actions", () => {
  it("creates WEBSOCKET_CONNECT with the websocket URL", () => {
    const action = connect("roomId");
    expect(action.type).toBe(WEBSOCKET_CONNECT);
    expect(action.payload).toContain("roomId");
  });

  it("creates WEBSOCKET_CLOSE actions", () => {
    const action = close();
    expect(action.type).toBe(WEBSOCKET_CLOSE);
  });

  it("creates WEBSOCKET_OPEN actions", () => {
    const action = open();
    expect(action.type).toBe(WEBSOCKET_OPEN);
  });

  it("creates WEBSOCKET_MESSAGE action", () => {
    const data = { test: 1 };
    const action = message(data);
    expect(action.type).toBe(WEBSOCKET_MESSAGE);
  });

  it("creates WEBSOCKET_ERROR action", () => {
    const exception = new Error("test");
    const action = error(exception);
    expect(action.type).toBe(WEBSOCKET_ERROR);
  });

  it("creates WEBSOCKET_RECONNECTED action", () => {
    const action = reconnected();
    expect(action.type).toBe(WEBSOCKET_RECONNECTED);
  });

  it("creates WEBSOCKET_RECONNECTING action", () => {
    const action = reconnecting();
    expect(action.type).toBe(WEBSOCKET_RECONNECTING);
  });

  it("creates WEBSOCKET_SEND action", () => {
    const data = { test: "dummy" };
    const action = send(data);
    expect(action.type).toBe(WEBSOCKET_SEND);
    expect(action.payload).toEqual(data);
  });
});
