import websocketMiddleware from "./websocket";
import { WEBSOCKET_OPEN } from "../actions/types";
import { close, connect } from "../actions/websocketActions";

const createWebSocket = () => {
  const websocket = {
    onopen: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
    onmessage: jest.fn(),
    send: jest.fn(),
    close: jest.fn()
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
  const { store, next, invoke } = createMiddleware();
  const { websocketConstructor, websocket } = createWebSocket();

  global.WebSocket = websocketConstructor;

  beforeEach(() => {
    websocketConstructor.mockClear();
    next.mockClear();
    websocket.close.mockClear();
    websocket.onmessage.mockClear();
  });

  describe("on WEBSOCKET_CONNECT action", () => {
    beforeEach(() => {
      invoke(connect("roomId"));
    });

    afterEach(() => {
      invoke(close());
    });

    it("creates the websocket", () => {
      expect(websocketConstructor).toHaveBeenCalledWith(
        "ws://localhost:2345/roomId"
      );
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

  describe("a connected websocket", () => {
    beforeEach(() => {
      invoke(connect("roomId"));
    });

    afterEach(() => {
      invoke(close());
    });

    describe("on WEBSOCKET_CLOSE action", () => {
      beforeEach(() => {
        invoke(close());
      });

      it("closes the websocket", () => {
        expect(websocket.close).toHaveBeenCalled();
      });
    });

    describe("on WEBSOCKET_CONNECT action", () => {
      it("throwns an error", () => {
        expect(() => invoke(connect("roomId"))).toThrow();
      });
    });

    describe("on websocket open message", () => {
      beforeEach(() => {
        store.dispatch.mockClear();
        websocket.onopen();
      });

      it("dispaches the WEBSOCKET_OPEN action", () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          type: WEBSOCKET_OPEN
        });
      });
    });
  });
});
