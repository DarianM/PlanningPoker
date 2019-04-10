import logReducer from "./logReducer";
import actions from "../actions/roomActions";
import { ASSIGN_ROOM, NEW_MEMBER } from "../actions/types";

describe("logReducer", () => {
  describe("before assinging a room, login data is required", () => {
    const login = actions.login({ user: "name" });
    const mockLoginFunc = jest.fn();
    login(mockLoginFunc);
    expect(mockLoginFunc).toBeCalledWith({
      type: NEW_MEMBER,
      payload: { member: "name", voted: false }
    });
    expect(mockLoginFunc).toBeCalledWith({
      type: ASSIGN_ROOM,
      payload: { user: "name", hasJoined: true }
    });
  });

  describe("when receives a create room action", () => {
    const initialState = {
      user: "",
      hasJoined: false
    };
    it("sets name for the new user, sets hasJoined to true and assings user a room", () => {
      const expected = {
        user: "name",
        hasJoined: true
      };

      expect(
        logReducer(initialState, {
          type: ASSIGN_ROOM,
          payload: { user: "name", hasJoined: true }
        })
      ).toEqual(expected);
    });
  });

  describe("in existing poker room", () => {
    const initialState = {
      nextMemberId: 2,
      members: [{ member: "Adrian", voted: true, id: 1 }]
    };
    it("handles new member by joining him", () => {
      const expected = {
        nextMemberId: 3,
        members: [
          { member: "Adrian", voted: true, id: 1 },
          { member: "ImNew", voted: false, id: 2 }
        ]
      };

      expect(
        logReducer(initialState, {
          type: NEW_MEMBER,
          payload: { member: "ImNew", voted: false }
        })
      ).toEqual(expected);
    });
  });

  describe("when admin clicks start game button", () => {
    it("saves starting time & should let members in room pick any card", () => {
      const initialState = { gameStart: null };
      const newState = logReducer(
        initialState,
        actions.startGame({ gameStart: Date })
      );

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
          logReducer(
            initialState,
            actions.memberVoted({ user: "John", voted: true })
          )
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

      expect(logReducer(initialState, actions.deleteVotes())).toEqual(expected);
    });
  });
});
