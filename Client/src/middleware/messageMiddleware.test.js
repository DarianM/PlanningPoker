import { messageMidTest } from "./messageMiddleware";

describe("message middleware", () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ gameRoom: { id: 1 } }))
  };

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    store.dispatch.mockClear();
  });

  describe("onmessage", () => {
    describe("USER_JOINED", () => {
      const reason = "USER_JOINED";
      const action = {
        type: "WEBSOCKET_MESSAGE",
        payload: { reason, data: { user: "random", userId: 1 } }
      };
      it("creates a new member", () => {
        messageMidTest(jest.fn())(store)(next)(action);
        expect(store.dispatch.mock.calls[0][0].type).toEqual("NEW_MEMBER");
        expect(store.dispatch).toHaveBeenCalledWith({
          type: "NEW_MEMBER",
          payload: {
            member: "random",
            id: 1
          }
        });
      });
    });
  });

  describe("onerror", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              roomId: 1
            }),
            ok: true
          })
        )
    );
    const interval = jest.fn();
    const action = {
      type: "WEBSOCKET_REJOIN",
      payload: interval
    };
    // describe("reconnect", () => {
    it("", () => {
      messageMidTest(mockFetch)(store)(next)(action);
      expect(store.dispatch.mock.calls).toEqual([[{ type: "WEBSOCKET_OPEN" }]]);
    });
    // });
  });
});
