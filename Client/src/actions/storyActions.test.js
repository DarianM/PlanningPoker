import {
  startStory,
  endStory,
  addVote,
  newStory,
  flipCards,
  deleteVotes
} from "./storyActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  start: jest.fn(),
  vote: jest.fn(),
  flip: jest.fn(),
  clearVotes: jest.fn()
}));

describe("add vote thunk mid", () => {
  const getState = jest.fn(() => ({
    stories: {
      byId: {
        1: {
          id: 1,
          start: new Date(),
          votes: []
        }
      },
      allIds: [],
      activeStoryId: 1
    },
    gameRoom: {
      user: "random",
      id: 1
    }
  }));
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
    it("should call Api to fetch some data", async () => {
      const result = addVote({ user: "me", voted: "20", id: 1 });
      const dispatch = jest.fn();
      await result(dispatch, getState);
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
      await result(dispatch, getState);
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
  const getState = jest.fn(() => ({ gameRoom: { id: 1 } }));
  const result = flipCards();
  it("should call Api.flip to fetch some data", () => {
    result(dispatch, getState);
    expect(Api.flip).toHaveBeenCalled();
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
  const getState = jest.fn(() => ({ gameRoom: { id: 1 } }));
  const result = deleteVotes();
  it("should call Api.clear ", () => {
    result(dispatch, getState);
    expect(Api.clearVotes).toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
  });
});

describe("start story thunk mid", () => {
  describe("without any stories left in the backlog", () => {
    const getState = jest.fn(() => ({
      stories: {
        byId: {},
        allIds: [],
        activeStoryId: undefined
      },
      gameRoom: {
        user: "random",
        id: 1
      }
    }));
    const dispatch = jest.fn();
    const result = startStory();
    it("should call dispatch with proper message", () => {
      result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        id: 2,
        type: "ADD_TOAST",
        payload: { text: "There are no more stories in the backlog" }
      });
    });
  });

  describe("with story a active", () => {
    const getState = jest.fn(() => ({
      stories: {
        byId: { 1: { id: 1, votes: [] } },
        allIds: [],
        activeStoryId: 1
      },
      gameRoom: {
        user: "random",
        id: 1
      }
    }));
    const dispatch = jest.fn();
    const result = startStory();
    it("should call Api.start", () => {
      result(dispatch, getState);
      expect(Api.start).toHaveBeenCalled();
    });
  });
});
