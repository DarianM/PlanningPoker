import logReducer from "./logReducer";
import {
  CREATE_ROOM,
  NEW_MEMBER,
  WEBSOCKET_OPEN,
  START_GAME,
  USER_VOTE,
  DELETE_VOTES
} from "../actions/types";

describe("logReducer", () => {
  describe("when receives a create room action type", () => {
    const initialState = {
      user: "",
      roomName: ""
    };
    it("sets name for the new user, name for the room and assings an id to room", () => {
      const expected = {
        user: "name",
        roomName: "room",
        id: 1
      };

      expect(
        logReducer(initialState, {
          type: CREATE_ROOM,
          payload: { user: "name", roomName: "room", id: 1 }
        })
      ).toEqual(expected);
    });
  });

  describe("whten receives that websocket has opened", () => {
    it("logs the user into his room", () => {
      const expected = {
        hasJoined: true
      };

      expect(
        logReducer(
          {},
          {
            type: WEBSOCKET_OPEN,
            payload: { hasJoined: true }
          }
        )
      ).toEqual(expected);
    });
  });

  describe("in existing poker room", () => {
    const initialState = {
      members: [{ member: "Adrian", voted: true, id: 1 }]
    };
    it("handles new member by joining him", () => {
      const expected = {
        members: [
          { member: "Adrian", voted: true, id: 1 },
          { member: "ImNew", voted: false, id: 2 }
        ]
      };

      expect(
        logReducer(initialState, {
          type: NEW_MEMBER,
          payload: { member: "ImNew", voted: false, id: 2 }
        })
      ).toEqual(expected);
    });
  });

  describe("when admin clicks start game button", () => {
    it("saves starting time & should let members in room pick any card", () => {
      const initialState = { gameStart: null };
      const newState = logReducer(initialState, {
        type: START_GAME,
        payload: { gameStart: Date }
      });

      expect(newState.gameStart).toBe(Date);
    });
  });

  describe("after games has started", () => {
    describe("display in room players who picked a card", () => {
      const initialState = {
        members: [
          { member: "John", voted: false, id: 1 },
          { member: "Adrian", voted: true, id: 2 }
        ]
      };
      it("updates member voting state", () => {
        const expected = {
          members: [
            { member: "John", voted: true, id: 1 },
            { member: "Adrian", voted: true, id: 2 }
          ]
        };

        expect(
          logReducer(initialState, {
            type: USER_VOTE,
            payload: { user: "John", voted: true }
          })
        ).toEqual(expected);
      });
    });
  });

  describe("admin clicks clear votes button anytime during the game", () => {
    const initialState = {
      members: [
        { member: "Jeff", voted: true, id: 1 },
        { member: "Jack", voted: true, id: 2 },
        { member: "Kevin", voted: false, id: 3 }
      ]
    };
    it("resets voted state for all members in room", () => {
      const expected = {
        members: [
          { member: "Jeff", voted: false, id: 1 },
          { member: "Jack", voted: false, id: 2 },
          { member: "Kevin", voted: false, id: 3 }
        ]
      };

      expect(logReducer(initialState, { type: DELETE_VOTES })).toEqual(
        expected
      );
    });
  });
});
