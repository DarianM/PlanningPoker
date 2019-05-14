import websocketMiddleware from "./websocket";
import { connect } from "../actions/websocketActions";

const createWebSocket = () => {
  const websocket = {
    onopen: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
    onmessage: jest.fn(),
    send: jest.fn()
  };
  const websocketConstructor = jest.fn(() => websocket);
  return { websocketConstructor, websocket };
};

const createMiddleware = () => {
  const store = {
    dispatch: jest.fn()
  };
  const next = jest.fn();
  const invoke = action => websocketMiddleware(store)(next)(action);

  return { store, next, invoke };
};

describe("websocket middleware", () => {
  const { invoke } = createMiddleware();
  const { websocketConstructor } = createWebSocket();

  global.WebSocket = websocketConstructor;

  describe("on WEBSOCKET_CONNECT action", () => {
    invoke(connect("roomId"));

    it("creates the websocket", () => {
      expect(websocketConstructor).toHaveBeenCalledWith(
        "ws://localhost:2345/roomId"
      );
    });
  });
});
