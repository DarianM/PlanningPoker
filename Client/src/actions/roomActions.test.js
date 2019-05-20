import { createRoom, joinRoom } from "./roomActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  create: jest.fn(),
  join: jest.fn(),
  vote: jest.fn()
}));

describe("create room action", () => {
  Api.create.mockImplementationOnce(
    () => new Promise((resolve, reject) => reject(new Error("error")))
  );
  describe("with network offline", () => {
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = createRoom({ user: "random", roomName: "room" });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({ type: "LOGIN_FAILURE" });
    });
  });

  describe("with server and network online", () => {
    Api.create.mockImplementationOnce(
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
      const result = createRoom({ user: "random", roomName: "room" });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls.pop()).toEqual([{ type: "LOGIN_SUCCES" }]);
    });
  });
});

describe("join room action", () => {
  describe("with network offline", () => {
    Api.join.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = joinRoom({ user: "random", roomId: 1 });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({ type: "LOGIN_FAILURE" });
    });
  });

  describe("with working network and server", () => {
    Api.join.mockImplementationOnce(
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
      const result = joinRoom({ user: "random", roomId: 1 });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls.pop()).toEqual([{ type: "LOGIN_SUCCES" }]);
    });
  });
});
