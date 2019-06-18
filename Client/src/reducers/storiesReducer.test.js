import storiesReducer from "./storiesReducer";
import {
  ADD_STORY,
  START_STORY,
  END_STORY,
  FLIP_CARDS,
  EDIT_STORY,
  REMOVE_MEMBER,
  DELETE_VOTES,
  RESET_TIMER,
  UPDATE_ROOM
} from "../actions/types";

describe("stories reducer", () => {
  describe("receiving an add story action type", () => {
    describe("when there is no active story", () => {
      const initialState = {
        byId: {},
        allIds: [],
        activeStoryId: undefined
      };
      it("should add this story as current story", () => {
        const expected = {
          byId: {
            1: { id: 1, text: "story", start: null, end: null, votes: [] }
          },
          allIds: [1],
          activeStoryId: 1
        };
        expect(
          storiesReducer(initialState, {
            type: ADD_STORY,
            payload: { id: 1, story: "story" }
          })
        ).toEqual(expected);
      });
    });
    describe("when there already is an active story", () => {
      const initialState = {
        byId: {
          1: { id: 1, text: "story", start: null, end: null, votes: [] }
        },
        allIds: [1],
        activeStoryId: 1
      };
      it("should only add this story in the list", () => {
        const expected = {
          byId: {
            1: { id: 1, text: "story", start: null, end: null, votes: [] },
            2: { id: 2, text: "other", start: null, end: null, votes: [] }
          },
          allIds: [1, 2],
          activeStoryId: 1
        };
        expect(
          storiesReducer(initialState, {
            type: ADD_STORY,
            payload: { id: 2, story: "other" }
          })
        ).toEqual(expected);
      });
    });
  });
  describe("receiving an start story action type", () => {
    const initialState = {
      byId: {
        1: { id: 1, text: "story", start: null, end: null, votes: [] }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should mark this story started", () => {
      const date = "2019-06-10T12:00:00";
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(date),
            end: null,
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: START_STORY,
          payload: { date }
        })
      ).toEqual(expected);
    });
  });
  describe("receiving an end story action type", () => {
    const startDate = "2019-06-10T11:56:07";
    const endDate = "2019-06-10T12:00:00";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: []
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should mark this story started", () => {
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(startDate),
            end: new Date(endDate),
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: END_STORY,
          payload: { date: endDate }
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving an flip cards action", () => {
    const startDate = "2019-06-10T11:56:07";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: []
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should add the votes for the story", () => {
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(startDate),
            end: null,
            votes: [
              { id: 1, name: "test", vote: 2 },
              { id: 2, name: "test2", vote: 3 }
            ]
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: FLIP_CARDS,
          payload: {
            votes: [
              { id: 1, name: "test", vote: 2 },
              { id: 2, name: "test2", vote: 3 }
            ]
          }
        })
      ).toEqual(expected);
    });
  });
  describe("when receiving edit story action", () => {
    const startDate = "2019-06-10T11:56:07";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: []
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should change the story text", () => {
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story-edited",
            start: new Date(startDate),
            end: null,
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: EDIT_STORY,
          payload: { id: 1, description: "story-edited" }
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving remove member action", () => {
    const startDate = "2019-06-10T11:56:07";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: [
            { id: 1, name: "test", vote: 3 },
            { id: 2, name: "test2", vote: 5 }
          ]
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should delete the member vote from the list, if voted", () => {
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(startDate),
            end: null,
            votes: [{ id: 1, name: "test", vote: 3 }]
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: REMOVE_MEMBER,
          payload: { name: "test2" }
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving delete votes action", () => {
    const startDate = "2019-06-10T11:56:07";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: [
            { id: 1, name: "test", vote: 3 },
            { id: 2, name: "test2", vote: 5 }
          ]
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should delete votes from the list", () => {
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(startDate),
            end: null,
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: DELETE_VOTES
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving reset timer action", () => {
    const startDate = "2019-06-10T11:56:07";
    const initialState = {
      byId: {
        1: {
          id: 1,
          text: "story",
          start: new Date(startDate),
          end: null,
          votes: []
        }
      },
      allIds: [1],
      activeStoryId: 1
    };
    it("should set the new start date ", () => {
      const newStartDate = "2019-06-10T11:58:35";
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: new Date(newStartDate),
            end: null,
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: RESET_TIMER,
          payload: { newDate: newStartDate }
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving an update room action", () => {
    const initialState = {
      byId: {},
      allIds: [],
      activeStoryId: undefined
    };
    it("update the state accordingly ", () => {
      const startDate = "2019-06-10T11:58:35";
      const expected = {
        byId: {
          1: {
            id: 1,
            text: "story",
            start: "2019-06-10T11:58:35",
            end: null,
            votes: []
          }
        },
        allIds: [1],
        activeStoryId: 1
      };
      expect(
        storiesReducer(initialState, {
          type: UPDATE_ROOM,
          payload: {
            roomStories: [
              {
                id: 1,
                description: "story",
                started: startDate,
                ended: null,
                isActive: true
              }
            ]
          }
        })
      ).toEqual(expected);
    });
  });

  describe("when receiving an unknown action", () => {
    const initialState = {
      byId: { 1: { id: 1, text: "story", start: null, end: null, votes: [] } },
      allIds: [1],
      activeStoryId: 1
    };
    it("will return the initial state ", () => {
      expect(
        storiesReducer(initialState, {
          type: "UNKNOWN_ACTION",
          payload: { obj: { info: null } }
        })
      ).toEqual(initialState);
    });
  });
});
