import { addVote, memberVoted, flipCards, deleteVotes } from "./storyActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  vote: jest.fn(),
  clearVotes: jest.fn()
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
  Api.clearVotes.mockImplementationOnce(
    () =>
      new Promise(resolve => {
        resolve({ ok: true });
      })
  );
  const dispatch = jest.fn();
  const result = deleteVotes({ flip: false, list: [] });
  it("should dispatch action to websocket middleware", () => {
    result(dispatch);
    expect(Api.clearVotes).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});
