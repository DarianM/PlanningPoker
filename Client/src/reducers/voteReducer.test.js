import voteReducer from "./storiesReducer";

describe("voteReducer", () => {
  describe("player clicks on a card after the game has started", () => {
    const initialState = {
      list: [{ user: "John", voted: "1/3", id: 1 }]
    };
    it("stores value picked by user and player name", () => {
      const expected = {
        list: [
          { user: "John", voted: "1/3", id: 1 },
          { user: "Adrian", voted: "40", id: 2 }
        ]
      };
      expect(
        voteReducer(initialState, {
          type: "ADD_VOTE",
          payload: { user: "Adrian", voted: "40", id: 2 }
        })
      ).toEqual(expected);
    });
  });

  describe("same player clicks another card", () => {
    const initialState = {
      list: [{ user: "Kevin", voted: "100", id: 1 }]
    };
    it("stores new value replacing the old one alongside the coresponding player", () => {
      const expected = {
        list: [{ user: "Kevin", voted: "13", id: 1 }]
      };

      expect(
        voteReducer(initialState, {
          type: "ADD_VOTE",
          payload: { user: "Kevin", voted: "13", id: 1 }
        })
      ).toEqual(expected);
    });
  });

  describe("admin forces display of votes by clicking flip button", () => {
    const initialState = { flip: false };
    it("replaces status vote of members with actual vote they chose", () => {
      const expected = { flip: true };

      expect(
        voteReducer(initialState, {
          type: "FLIP_CARDS",
          payload: { flip: true }
        })
      ).toEqual(expected);
    });
  });

  describe("clear votes is clicked anytime after game started", () => {
    const initialState = {
      list: [
        { user: "Mike", voted: "40", id: 1 },
        { user: "John", voted: "100", id: 2 }
      ]
    };
    it("deletes all votes in current story", () => {
      const expected = { list: [] };

      expect(
        voteReducer(initialState, {
          type: "DELETE_VOTES",
          payload: { list: [] }
        })
      ).toEqual(expected);
    });
  });

  describe("waiting on admin to finalise voting", () => {
    const initialState = { end: false };
    it("ends current game and display statistics", () => {
      const expected = { end: true };

      expect(
        voteReducer(initialState, { type: "END_GAME", payload: { end: true } })
      ).toEqual(expected);
    });
  });

  describe("action type is not recognized", () => {
    const initialState = {};
    it("should return initial state", () => {
      expect(
        voteReducer(initialState, {
          type: "I_DON'T_KNOW_THIS_ACTION",
          payload: { property: true }
        })
      ).toEqual(initialState);
    });
  });
});
