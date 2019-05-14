import { connect, close } from "./websocketActions";
import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "./types";

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
});
