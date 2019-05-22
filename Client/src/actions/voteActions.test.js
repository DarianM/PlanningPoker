import { addVote, memberVoted, flipCards, deleteVotes } from "./voteActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  vote: jest.fn()
}));

describe("add vote thunk mid", () => {
  describe("with connection ok and valid vote", () => {
    Api.vote.mockImplementationOnce(
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
      const result = addVote({ user: "me", voted: "20", id: 1 });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(Api.vote).toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when error occurs on vote", () => {
    Api.vote.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should dispatch toast with error message", async () => {
      const result = addVote({ user: "me", voted: "20", id: 1 });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch).toBeCalledWith({
        id: 1,
        type: "ADD_TOAST",
        payload: { text: "error" }
      });
    });
  });
});

describe("member voted thunk mid", () => {
  describe("after user has voted successfully", () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const result = memberVoted({ user: "you", voted: true });
    it("should dispatch action modifing user voting state", () => {
      result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        type: "USER_VOTE",
        payload: { user: "you", voted: true }
      });
    });
  });

  describe("after all users have voted successfully", () => {
    const dispatch = jest.fn();
    const getState = jest.fn(() => ({
      gameRoom: {
        members: [
          { member: "me", voted: true, id: 1 },
          { member: "you", voted: true, id: 2 }
        ]
      }
    }));

    const result = memberVoted({ user: "you", voted: true });
    it("should dispatch flip cards action", async () => {
      await result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        type: "USER_VOTE",
        payload: { user: "you", voted: true }
      });
      expect(dispatch).toBeCalledWith({
        type: "USER_VOTE",
        payload: { user: "you", voted: true }
      });
      expect(dispatch).toBeCalledWith({
        type: "FLIP_CARDS",
        payload: { flip: true }
      });
    });
  });
});

describe("flip cards thunk mid", () => {
  const dispatch = jest.fn();
  const result = flipCards({ flip: true });
  it("should dispatch action to websocket middleware", () => {
    result(dispatch);
    expect(dispatch).toBeCalledWith({
      type: "WEBSOCKET_SEND",
      payload: { reason: "FLIP_CARDS", data: { flip: true } }
    });
  });
});

describe("clear votes thunk mid", () => {
  const dispatch = jest.fn();
  const result = deleteVotes({ flip: false, list: [] });
  it("should dispatch action to websocket middleware", () => {
    result(dispatch);
    expect(dispatch).toBeCalledWith({
      type: "WEBSOCKET_SEND",
      payload: { reason: "CLEAR_VOTES", data: { flip: false, list: [] } }
    });
  });
});
