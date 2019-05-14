import socketMiddleware from "./websocket";

describe("websocket", () => {
  const ws = {
    onopen: jest.fn(),
    onerror: jest.fn(),
    onclose: jest.fn(),
    onmessage: jest.fn(),
    send: jest.fn()
  };
  const url = "ws://fake.com";
  global.WebSocket = jest.fn(() => ws);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe("connect", () => {
    const next = jest.fn();
    const store = { dispatch: jest.fn() };
    const action = { type: "WEBSOCKET_CONNECT", payload: { url } };
    it("creates a new WebSocket instance", () => {
      socketMiddleware(store)(next)(action);
      expect(global.WebSocket).toHaveBeenCalledTimes(1);
      expect(global.WebSocket).toHaveBeenCalledWith({ url });
      ws.onopen();
      jest.advanceTimersByTime(7000);
      expect(store.dispatch.mock.calls).toEqual([[{ type: "WEBSOCKET_OPEN" }]]);
      expect(ws.send).toHaveBeenCalledWith("ping");
    });
  });
});
