import { messageMidTest } from "./messageMiddleware";
import {
  ADD_TOAST,
  UPDATE_ROOM,
  NEW_MEMBER,
  ADD_VOTE,
  FLIP_CARDS,
  USER_VOTE
} from "../actions/types";

describe("message middleware", () => {
  const next = jest.fn();
  const store = {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({ gameRoom: { id: 1 } }))
  };

  beforeAll(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => new Date("2019-04-09T11:05:20").valueOf());
  });

  afterAll(() => {
    jest.useRealTimers();
    Date.now = global.Date.now();
  });

  afterEach(() => {
    store.dispatch.mockClear();
  });

  describe("on MESSAGE", () => {
    describe("USER_JOINED", () => {
      const reason = "USER_JOINED";
      const action = {
        type: "WEBSOCKET_MESSAGE",
        payload: { reason, data: { user: "random", userId: 1 } }
      };
      it("creates a new member", () => {
        messageMidTest(jest.fn())(store)(next)(action);
        expect(store.dispatch.mock.calls[0][0].type).toEqual(NEW_MEMBER);
        expect(store.dispatch).toHaveBeenCalledWith({
          type: "NEW_MEMBER",
          payload: {
            member: "random",
            id: 1
          }
        });
      });
    });

    describe("USER_VOTED", () => {
      const reason = "USER_VOTED";
      const action = {
        type: "WEBSOCKET_MESSAGE",
        payload: { reason, data: { user: "random", voted: 40, id: 1 } }
      };
      it("stores the vote and keeps a evidence", () => {
        messageMidTest(jest.fn())(store)(next)(action);
        expect(store.dispatch.mock.calls[0][0].type).toEqual(USER_VOTE);
      });
    });

    describe("FLIP_CARDS", () => {
      const reason = "FLIP_CARDS";
      const action = {
        type: "WEBSOCKET_MESSAGE",
        payload: { reason, data: { flip: true } }
      };
      it("stores flip cards property", () => {
        messageMidTest(jest.fn())(store)(next)(action);
        expect(store.dispatch.mock.calls[0][0].type).toEqual(FLIP_CARDS);
      });
    });

    describe("on WEBSOCKET_RECONNECTED", () => {
      describe("reconnected", () => {
        const mockFetch = jest.fn(
          () =>
            new Promise((resolve, reject) =>
              resolve({
                json: () => ({
                  roomId: 1
                }),
                status: 200
              })
            )
        );
        const interval = jest.fn();
        const action = {
          type: "WEBSOCKET_RECONNECTED",
          payload: interval
        };
        it("reconnects to room and displays a toast with msg great success", async () => {
          await messageMidTest(mockFetch)(store)(next)(action);
          expect(store.dispatch.mock.calls[0][0].type).toBe(UPDATE_ROOM);
          expect(store.dispatch.mock.calls[1][0].type).toBe(ADD_TOAST);
        });
      });

      describe("server offline", () => {
        const mockFetch = jest.fn(
          () =>
            new Promise((resolve, reject) =>
              resolve({
                json: () => ({
                  roomId: 1
                }),
                status: 400
              })
            )
        );
        const interval = jest.fn();
        const action = {
          type: "WEBSOCKET_RECONNECTED",
          payload: interval
        };
        it("display message toast reconnecting failed", async () => {
          await messageMidTest(mockFetch)(store)(next)(action);
          expect(store.dispatch.mock.calls[0][0].type).toBe(ADD_TOAST);
          expect(store.dispatch.mock.calls[0][0].payload.text).toBe(
            "Server seems to be offline. Retrying..."
          );
        });
      });

      describe("reconnection failed", () => {
        const mockFetch = jest.fn(
          () => new Promise((resolve, reject) => reject())
        );
        const interval = jest.fn();
        const action = {
          type: "WEBSOCKET_RECONNECTED",
          payload: interval
        };
        it("display message toast reconnecting failed", async () => {
          await messageMidTest(mockFetch)(store)(next)(action);
          expect(store.dispatch.mock.calls[0][0].type).toBe(ADD_TOAST);
          expect(store.dispatch.mock.calls[0][0].payload.text).toBe(
            "Reconnecting failed..."
          );
        });
      });
    });
  });
});
