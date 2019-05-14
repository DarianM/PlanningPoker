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
  const { next, invoke } = createMiddleware();
  const { websocketConstructor } = createWebSocket();

  global.WebSocket = websocketConstructor;

  beforeEach(() => {
    websocketConstructor.mockReset();
    next.mockReset();
  });

  describe("on WEBSOCKET_CONNECT action", () => {
    beforeEach(() => {
      invoke(connect("roomId"));
    });

    it("creates the websocket", () => {
      expect(websocketConstructor).toHaveBeenCalledWith(
        "ws://localhost:2345/roomId"
      );
    });

    it("calls the next middleware", () => {
      expect(next).toHaveBeenCalled();
    });
  });

  describe("on UNKNOWN_ACTION", () => {
    beforeEach(() => {
      invoke({ type: "UNKNOWN_ACTION" });
    });

    it("does NOT create the websocket", () => {
      expect(websocketConstructor).not.toHaveBeenCalled();
    });

    it("calls the next middleware", () => {
      expect(next).toHaveBeenCalled();
    });
  });
});
