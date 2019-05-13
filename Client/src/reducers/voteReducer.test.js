import voteReducer from "./voteReducer";
import {
  addVote,
  flipCards,
  deleteVotes,
  endGame
} from "../actions/roomActions";

describe("voteReducer", () => {
  describe("player clicks on a card after the game has started", () => {
    const initialState = {
      nextVoteId: 2,
      list: [{ user: "John", voted: "1/3", id: 1 }]
    };
    it("stores value picked by user and player name", () => {
      const expected = {
        nextVoteId: 3,
        list: [
          { user: "John", voted: "1/3", id: 1 },
          { user: "Adrian", voted: "40", id: 2 }
        ]
      };
      expect(
        voteReducer(initialState, addVote({ user: "Adrian", voted: "40" }))
      ).toEqual(expected);
    });
  });

  describe("same player clicks another card", () => {
    const initialState = {
      nextVoteId: 2,
      list: [{ user: "Kevin", voted: "100", id: 1 }]
    };
    it("stores new value replacing the old one alongside the coresponding player", () => {
      const expected = {
        nextVoteId: 2,
        list: [{ user: "Kevin", voted: "13", id: 1 }]
      };

      expect(
        voteReducer(initialState, addVote({ user: "Kevin", voted: "13" }))
      ).toEqual(expected);
    });
  });

  describe("admin forces display of votes by clicking flip button", () => {
    const initialState = { flip: false };
    it("replaces status vote of members with actual vote they chose", () => {
      const expected = { flip: true };

      expect(voteReducer(initialState, flipCards({ flip: true }))).toEqual(
        expected
      );
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

      expect(voteReducer(initialState, deleteVotes({ list: [] }))).toEqual(
        expected
      );
    });
  });

  describe("waiting on admin to finalise voting", () => {
    const initialState = { end: false };
    it("ends current game and display statistics", () => {
      const expected = { end: true };

      expect(voteReducer(initialState, endGame({ end: true }))).toEqual(
        expected
      );
    });
  });
});
