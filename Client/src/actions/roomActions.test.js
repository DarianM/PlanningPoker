import {
  createRoom,
  joinRoom,
  removeMember,
  editRoomName,
  newMember,
  renameRoom,
  memberVoted
} from "./roomActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  create: jest.fn(),
  join: jest.fn(),
  vote: jest.fn(),
  updateRoomName: jest.fn()
}));

describe("create room action", () => {
  Api.create.mockImplementationOnce(
    () =>
      new Promise((resolve, reject) =>
        reject([{ message: "err", location: "unknown" }])
      )
  );
  describe("with network offline", () => {
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = createRoom({ user: "random", roomName: "room" });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({
        type: "LOGIN_FAILURE",
        payload: "err"
      });
    });
  });

  describe("with server and network online", () => {
    Api.create.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            roomId: 1,
            memberId: 1
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
      () =>
        new Promise((resolve, reject) =>
          reject([{ message: "err", location: "unknown" }])
        )
    );
    it("should dispatch LOGIN_FAILURE", async () => {
      const result = joinRoom({ user: "random", roomId: 1 });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({
        type: "LOGIN_FAILURE",
        payload: { location: "unknown", message: "err" }
      });
    });
  });

  describe("with working network and server", () => {
    Api.join.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) =>
          resolve({
            roomInfo: {
              user: "name",
              roomName: "randomName",
              userId: 1
            },
            roomId: 1,
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

  describe("remove member action", () => {
    it("should dispatch remove member", async () => {
      const result = removeMember({ name: "test" });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({
        type: "REMOVE_MEMBER",
        payload: { name: "test" }
      });
    });
  });

  describe("edit room name", () => {
    describe("with a valid name", () => {
      it("should successfully rename the room", async () => {
        const result = editRoomName({ roomName: "NewName", roomId: 1 });
        const dispatch = jest.fn();
        await result(dispatch);
        expect(Api.updateRoomName).toHaveBeenCalled();
      });
    });
    describe("with an invalid name", () => {
      it("should dispatch toast", async () => {
        const result = editRoomName({ roomName: "./", roomId: 1 });
        const dispatch = jest.fn();
        await result(dispatch);
        expect(dispatch).toHaveBeenCalled();
      });
    });
  });

  describe("new member", () => {
    it("should return correspondent action for reducer", () => {
      const payload = { member: "test", id: 1, voted: false };
      const result = newMember(payload);
      expect(result).toEqual({ type: "NEW_MEMBER", payload });
    });
  });

  describe("member voted", () => {
    it("should return proper action for reducer", () => {
      const payload = { user: "test", voted: true };
      const result = memberVoted(payload);
      expect(result).toEqual({ type: "USER_VOTE", payload });
    });
  });

  describe("rename room", () => {
    it("should return correspondent action for reducer", () => {
      const payload = { roomId: 1, roomName: "newName" };
      const result = renameRoom(payload);
      expect(result).toEqual({ type: "RENAME_ROOM", payload });
    });
  });
});
