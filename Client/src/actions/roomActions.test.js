import { createRoomF, joinRoomF, addVoteF } from "./roomActions";

describe("create room action", () => {
  describe("with network offline", () => {
    const mockFetch = jest.fn(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = createRoomF(
        { user: "random", roomName: "room" },
        mockFetch
      );
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_FAILURE" }]);
    });
  });

  describe("with error from server", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              roomName: "randomName",
              user: "name"
            }),
            ok: false
          })
        )
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = createRoomF(
        { user: "random", roomName: "room" },
        mockFetch
      );
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_FAILURE" }]);
    });
  });

  describe("with server and network online", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              roomName: "randomName",
              user: "aName"
            }),
            ok: true
          })
        )
    );
    it("should dispatch LOGIN_SUCCES", async () => {
      const result = createRoomF(
        { user: "random", roomName: "room" },
        mockFetch
      );
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_SUCCES" }]);
    });
  });
});

describe("join room action", () => {
  describe("with network offline", () => {
    const mockFetch = jest.fn(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = joinRoomF({ user: "random", roomId: 1 }, mockFetch);
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_FAILURE" }]);
    });
  });

  describe("with error from server", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              roomName: "randomName",
              user: "name"
            }),
            status: 504
          })
        )
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = joinRoomF({ user: "random", roomId: 1 }, mockFetch);
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_FAILURE" }]);
    });
  });

  describe("with working network and server", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              roomName: "randomName",
              user: "name"
            }),
            status: 200
          })
        )
    );
    it("should dispatch LOGIN_SUCCESS", async () => {
      const result = joinRoomF({ user: "random", roomId: 1 }, mockFetch);
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([{ type: "LOGIN_SUCCES" }]);
    });
  });

  describe("with error message from server", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            json: () => ({
              error: "some msg..."
            }),
            status: 400
          })
        )
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = joinRoomF({ user: "random", roomId: 1 }, mockFetch);
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([
        { payload: "some msg...", type: "LOGIN_FAILURE" }
      ]);
    });
  });
});

describe("add vote action", () => {
  describe("with connection ok and valid vote", () => {
    const mockFetch = jest.fn(
      () =>
        new Promise(resolve => {
          resolve({
            json: () => ({
              id: 5
            }),
            ok: true
          });
        })
    );
    it("should dispatch websocket send", async () => {
      const result = addVoteF(
        { user: "me", roomId: 1, voted: "20" },
        mockFetch
      );
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls[0][0].type).toBe("WEBSOCKET_SEND");
    });
  });
});
