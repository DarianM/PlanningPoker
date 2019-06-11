import {
  addVote,
  flipCards,
  flippingCards,
  deleteVotes,
  deletingVotes,
  newStory,
  addingStory,
  startStory,
  startingStory,
  endStory,
  endingStory,
  editStory,
  renamingStory,
  resetTimer,
  resetingTimer
} from "./storyActions";
import * as Api from "../Api";

jest.mock("../Api", () => ({
  start: jest.fn(),
  resetTimer: jest.fn(),
  end: jest.fn(),
  vote: jest.fn(),
  flip: jest.fn(),
  clearVotes: jest.fn(),
  addStory: jest.fn(),
  editStory: jest.fn()
}));

beforeAll(() => {
  jest.useFakeTimers();
  Date.now = jest.fn(() => 5000);
});

afterAll(() => {
  jest.useRealTimers();
  Date.now = global.Date.now();
});

beforeEach(() => jest.clearAllMocks());

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
  describe("with connection ok, valid vote, game started and not flipped", () => {
    Api.vote.mockImplementationOnce(
      () =>
        new Promise(resolve => {
          resolve({
            id: 5
          });
        })
    );
    it("should call Api to fetch some data", async () => {
      const result = addVote({ value: "20" });
      const dispatch = jest.fn();
      await result(dispatch, getState);
      expect(Api.vote).toHaveBeenCalled();
      expect(dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when error occurs on vote", () => {
    Api.vote.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject([{ message: "error" }]))
    );
    it("should dispatch toast with error message", async () => {
      const result = addVote({ value: "20" });
      const dispatch = jest.fn();
      await result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        type: "ADD_TOAST",
        payload: { expires: 8000, text: "error" }
      });
    });
  });
  describe("with connection, ok, but game hasn't started", () => {
    const getState = jest.fn(() => ({
      stories: {
        byId: {
          1: {
            id: 1,
            start: false,
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
    it("should display toast 'Press start'", async () => {
      const result = addVote({ value: "20" });
      const dispatch = jest.fn();
      await result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        type: "ADD_TOAST",
        payload: { expires: 8000, text: "Press start" }
      });
    });
  });
  describe("with connection, ok, game started and votes are flipped", () => {
    const getState = jest.fn(() => ({
      stories: {
        byId: {
          1: {
            id: 1,
            start: new Date(),
            votes: [{ id: 1, name: "me", vote: 20 }]
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
    it("should do nothing", async () => {
      const result = addVote({ value: "25" });
      const dispatch = jest.fn();
      await result(dispatch, getState);
      expect(dispatch).not.toHaveBeenCalled();
      expect(Api.vote).not.toHaveBeenCalled();
    });
  });
});

describe("flip cards thunk mid", () => {
  const getState = jest.fn(() => ({ gameRoom: { id: 1 } }));
  describe("succeding", () => {
    Api.flip.mockImplementationOnce(
      () =>
        new Promise(resolve =>
          resolve({ votes: [{ id: 1, name: "test", vote: 2 }] })
        )
    );
    it("should call Api.flip to fetch some data", async () => {
      const dispatch = jest.fn();
      const result = flipCards();
      await result(dispatch, getState);
      expect(Api.flip).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(2);
    });
  });
  describe("failing", () => {
    Api.flip.mockImplementationOnce(
      () => new Promise((resolve, reject) => reject([{ message: "error" }]))
    );
    it("should dispatch toast with error message", async () => {
      const dispatch = jest.fn();
      const result = flipCards();
      await result(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({ type: "FLIP_FAILURE" });
    });
  });
});

describe("flipping cards", () => {
  it("should return proper action for reducer", () => {
    const payload = { votes: [{ user: "test", id: 1, vote: "20" }] };
    const result = flippingCards(payload);
    expect(result).toEqual({ type: "FLIP_CARDS", payload });
  });
});

describe("clear votes thunk mid", () => {
  describe("success", () => {
    Api.clearVotes.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          resolve({});
        })
    );
    it("should call Api.clearVotes ", async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({ gameRoom: { id: 1 } }));
      const result = deleteVotes();
      await result(dispatch, getState);
      expect(Api.clearVotes).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith({
        type: "CLEAR_STARTING"
      });
      expect(dispatch).toHaveBeenCalledWith({
        type: "CLEAR_SUCCESS"
      });
    });
  });
  describe("failure", () => {
    Api.clearVotes.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          reject([{ message: "error" }]);
        })
    );
    it("should dispatch toast with error ", async () => {
      const dispatch = jest.fn();
      const getState = jest.fn(() => ({ gameRoom: { id: 1 } }));
      const result = deleteVotes();
      await result(dispatch, getState);
      expect(dispatch).toHaveBeenCalled();
    });
  });
});

describe("deleting votes", () => {
  it("should return proper action for reducer", () => {
    const result = deletingVotes();
    expect(result).toEqual({ type: "DELETE_VOTES" });
  });
});

describe("new story", () => {
  describe("when there is no active story", () => {
    it("should mark current story as active", async () => {
      const getState = jest.fn(() => ({
        stories: {
          activeStoryId: undefined
        }
      }));
      const dispatch = jest.fn();
      const result = newStory({ story: "new story", roomId: 1 });
      await result(dispatch, getState);
      expect(Api.addStory.mock.calls[0][2]).toBe(true);
    });
  });
  describe("when there already is an active story", () => {
    it("should not mark current story as active", async () => {
      const getState = jest.fn(() => ({
        stories: {
          activeStoryId: 1
        }
      }));
      const dispatch = jest.fn();
      const result = newStory({ story: "new story", roomId: 1 });
      await result(dispatch, getState);
      expect(Api.addStory.mock.calls[0][2]).toBe(false);
    });
  });
});

describe("adding story", () => {
  it("should return proper action for reducer", () => {
    const payload = { id: 2, story: "new story" };
    const result = addingStory(payload);
    expect(result).toEqual({ type: "ADD_STORY", payload });
  });
});

describe("start story thunk mid", () => {
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
  describe("with story a active", () => {
    it("should call Api.start", async () => {
      const dispatch = jest.fn();
      const result = startStory();
      await result(dispatch, getState);
      expect(Api.start).toHaveBeenCalled();
    });
  });

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
    it("should call dispatch with proper message", async () => {
      const dispatch = jest.fn();
      const result = startStory();
      await result(dispatch, getState);
      expect(dispatch).toBeCalledWith({
        type: "ADD_TOAST",
        payload: {
          expires: 8000,
          text: "There are no more stories in the backlog"
        }
      });
    });
  });

  describe("with error from server", () => {
    it("should dispath game failure", async () => {
      Api.start.mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            reject([{ message: "error" }]);
          })
      );
      const dispatch = jest.fn();
      const result = startStory();
      await result(dispatch, getState);
      expect(dispatch).toHaveBeenCalledWith({ type: "GAME_STARTING" });
      expect(dispatch).toHaveBeenCalledWith({
        payload: [{ message: "error" }],
        type: "GAME_FAILURE"
      });
    });
  });

  describe("starting story", () => {
    it("should return proper action for reducer", () => {
      const payload = { date: 10000 };
      const result = startingStory(payload);
      expect(result).toEqual({ type: "START_STORY", payload });
    });
  });

  describe("end story", () => {
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
    describe("succeding", () => {
      it("should dispatch end success", async () => {
        const dispatch = jest.fn();
        const result = endStory();
        await result(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({ type: "END_STARTING" });
        expect(dispatch).toHaveBeenCalledWith({ type: "END_SUCCESS" });
      });
    });
    describe("failing", () => {
      it("should dispatch end failure", async () => {
        Api.end.mockImplementationOnce(
          () => new Promise((resolve, reject) => reject([{ message: "error" }]))
        );
        const dispatch = jest.fn();
        const result = endStory();
        await result(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith({ type: "END_STARTING" });
        expect(dispatch).toHaveBeenCalledWith({ type: "END_FAILURE" });
        expect(dispatch).toHaveBeenCalledWith({
          type: "ADD_TOAST",
          payload: { expires: 8000, text: "error" }
        });
      });
    });
  });

  describe("ending story", () => {
    it("should return proper action for reducer", () => {
      const payload = { date: 15000 };
      const result = endingStory(payload);
      expect(result).toEqual({ type: "END_STORY", payload });
    });
  });

  describe("edit story", () => {
    describe("with valid name", () => {
      it("should call Api.editStory", async () => {
        const dispatch = jest.fn();
        const result = editStory({ value: "newName", id: 1, roomId: 1 });
        await result(dispatch);
        expect(Api.editStory).toHaveBeenCalled();
        expect(dispatch).not.toHaveBeenCalled();
      });
    });
    describe("with valid name, but error from server", () => {
      it("should dispatch error message", async () => {
        Api.editStory.mockImplementationOnce(
          () => new Promise((resolve, reject) => reject([{ message: "error" }]))
        );
        const dispatch = jest.fn();
        const result = editStory({ value: "newName", id: 1, roomId: 1 });
        await result(dispatch);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith({
          type: "ADD_TOAST",
          payload: { expires: 8000, text: "error" }
        });
      });
    });
  });

  describe("renaming story", () => {
    it("should return proper action for reducer", () => {
      const payload = { id: 1, description: "Renamed story" };
      const result = renamingStory(payload);
      expect(result).toEqual({ type: "EDIT_STORY", payload });
    });
  });

  describe("reset timer", () => {
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
    describe("succeding", () => {
      it("should dispatch reset success", async () => {
        const dispatch = jest.fn();
        const result = resetTimer();
        await result(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(dispatch).toHaveBeenCalledWith({ type: "RESET_STARTING" });
        expect(dispatch).toHaveBeenCalledWith({ type: "RESET_SUCCESS" });
      });
    });
    describe("failing", () => {
      it("should dispatch reset failiure", async () => {
        Api.resetTimer.mockImplementationOnce(
          () =>
            new Promise((resolve, reject) => {
              reject([{ message: "error" }]);
            })
        );
        const dispatch = jest.fn();
        const result = resetTimer();
        await result(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith({ type: "RESET_STARTING" });
        expect(dispatch).toHaveBeenCalledWith({ type: "RESET_FAILURE" });
        expect(dispatch).toHaveBeenCalledWith({
          type: "ADD_TOAST",
          payload: { expires: 8000, text: "error" }
        });
      });
    });
  });

  describe("reseting timer", () => {
    it("should return proper action for reducer", () => {
      const payload = { newDate: 12000 };
      const result = resetingTimer(payload);
      expect(result).toEqual({ type: "RESET_TIMER", payload });
    });
  });
});
