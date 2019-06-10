import websocketMiddleware from "./websocketMiddleware";
import {
  WEBSOCKET_OPEN,
  WEBSOCKET_MESSAGE,
  WEBSOCKET_ERROR,
  WEBSOCKET_RECONNECTING,
  WEBSOCKET_RECONNECTED
} from "../actions/types";
import { close, connect, send } from "../actions/websocketActions";

const ABNORMAL_CLOSURE = 1006;

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
    websocketConstructor.mockImplementation(() => websocket);
    next.mockClear();
    websocket.close.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe("on WEBSOCKET_CONNECT action", () => {
    beforeEach(() => {
      invoke(
        connect(
          "roomId",
          "userId"
        )
      );
    });

    afterEach(() => {
      invoke(close());
    });

    it("creates the websocket", () => {
      expect(websocketConstructor).toHaveBeenCalledWith(
        "ws://localhost:2345/roomId/userId"
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

  describe("on WEBSOCKET_SEND", () => {
    beforeEach(() => {
      websocket.send.mockClear();
      invoke(send({}));
    });

    it("does NOT call send on the socket since the websocket is not connected", () => {
      expect(websocket.send).not.toHaveBeenCalled();
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
      it("throws an error", () => {
        expect(() => invoke(connect("roomId"))).toThrow();
      });
    });

    describe("on WEBSOCKET_SEND", () => {
      const data = { test: "dummy" };
      beforeEach(() => {
        websocket.send.mockClear();
        invoke(send(data));
      });

      it("calls send on the socket", () => {
        expect(websocket.send).toHaveBeenCalledWith(JSON.stringify(data));
      });
    });

    describe("on websocket open message", () => {
      beforeEach(() => {
        store.dispatch.mockClear();
        websocket.onopen();
      });

      it("dispatches the WEBSOCKET_OPEN action", () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          type: WEBSOCKET_OPEN
        });
      });

      it("does NOT dispatch WEBSOCKET_RECONNECTED", () => {
        expect(store.dispatch).not.toHaveBeenCalledWith({
          type: WEBSOCKET_RECONNECTED
        });
      });
    });

    describe("on a websocket message with a JSON payload", () => {
      const dummy = { dummy: 1 };
      beforeEach(() => {
        store.dispatch.mockClear();
        websocket.onmessage({ data: JSON.stringify(dummy) });
      });

      it("dispatches the WEBSOCKET_MESSAGE action", () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          type: WEBSOCKET_MESSAGE,
          payload: dummy
        });
      });
    });

    describe("on a websocket message with an invalid payload", () => {
      beforeEach(() => {
        store.dispatch.mockClear();
      });

      it("throws an error", () => {
        expect(() => websocket.onmessage({ data: "invalid" })).toThrow();
      });

      it("WEBSOCKET_MESSAGE action is NOT dispatches", () => {
        expect(store.dispatch).not.toHaveBeenCalled();
      });
    });

    describe("when the socket is broken", () => {
      beforeEach(() => {
        store.dispatch.mockClear();
        websocket.onclose({ code: ABNORMAL_CLOSURE });
      });

      it("dispatches an WEBSOCKET_ERROR action", () => {
        expect(store.dispatch).toHaveBeenCalledWith({
          type: WEBSOCKET_ERROR,
          payload: expect.any(Error)
        });
      });
    });
  });

  describe("a broken websocket", () => {
    beforeEach(() => {
      invoke(connect("roomId"));
      websocketConstructor.mockClear();
      store.dispatch.mockClear();
      websocket.onclose({ code: ABNORMAL_CLOSURE });
      jest.runOnlyPendingTimers();
      websocket.onopen();
    });

    afterEach(() => {
      invoke(close());
    });

    it("will reconnect after a delay", () => {
      expect(websocketConstructor).toHaveBeenCalled();
    });

    it("triggers WEBSOCKET_RECONNECTING action while reconnecting", () => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: WEBSOCKET_RECONNECTING
      });
    });

    it("triggers WEBSOCKET_RECONNECTED action when the connection is re-established", () => {
      expect(store.dispatch).toHaveBeenCalledWith({
        type: WEBSOCKET_RECONNECTED
      });
    });
  });

  describe("a broken websocket which fails to reconnect the first 2 times", () => {
    beforeEach(() => {
      let count = 0;
      invoke(connect("roomId"));
      websocketConstructor.mockClear();
      websocketConstructor.mockImplementation(() => {
        if (count < 2) {
          count += 1;
          throw new Error("broken");
        }
        return websocket;
      });

      store.dispatch.mockClear();
      websocket.onclose({ code: ABNORMAL_CLOSURE });
    });

    afterEach(() => {
      invoke(close());
    });

    it("will try to reconnect after the re-try interval", () => {
      store.dispatch.mockClear();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();

      expect(
        store.dispatch.mock.calls.filter(
          c => c[0].type === WEBSOCKET_RECONNECTING
        ).length
      ).toBe(2);
    });

    it("will reconnect the third time", () => {
      store.dispatch.mockClear();
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      websocket.onopen();

      expect(store.dispatch).toHaveBeenCalledWith({
        type: WEBSOCKET_RECONNECTED
      });
    });
  });
});
