import { connect, close, open } from "./websocketActions";
import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE, WEBSOCKET_OPEN } from "./types";

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
});
