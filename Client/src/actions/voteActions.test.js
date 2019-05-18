import { addVote } from "./voteActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  vote: jest.fn()
}));

describe("add vote action", () => {
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

  describe("with connection ok and valid vote", () => {
    Api.vote.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should dispatch websocket send", async () => {
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
