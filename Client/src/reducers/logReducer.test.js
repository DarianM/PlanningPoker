import logReducer from "./logReducer";
import {
  CREATE_ROOM,
  RENAME_ROOM,
  NEW_MEMBER,
  WEBSOCKET_OPEN,
  USER_VOTE,
  REMOVE_MEMBER,
  DELETE_VOTES,
  UPDATE_ROOM
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

  describe("when receives a websocket open action", () => {
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

  describe("when receives rename room action", () => {
    const initialState = {
      user: "name",
      roomName: "room",
      id: 1
    };
    it("should change room's name", () => {
      const expected = {
        user: "name",
        roomName: "room-edited",
        id: 1
      };

      expect(
        logReducer(initialState, {
          type: RENAME_ROOM,
          payload: { roomName: "room-edited" }
        })
      ).toEqual(expected);
    });
  });

  describe("when receives new member action", () => {
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

  describe("when receives an user vote action", () => {
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

  describe("when receives a remove member action", () => {
    const initialState = {
      members: [
        { member: "John", voted: false, id: 1 },
        { member: "Adrian", voted: true, id: 2 }
      ]
    };
    it("updates members list", () => {
      const expected = {
        members: [{ member: "John", voted: false, id: 1 }]
      };

      expect(
        logReducer(initialState, {
          type: REMOVE_MEMBER,
          payload: { name: "Adrian" }
        })
      ).toEqual(expected);
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

  describe("when receives an update room action", () => {
    const initialState = {
      user: "",
      roomName: ""
    };

    it("should update the room accordingly", () => {
      const expected = {
        user: "user2",
        id: 1,
        roomName: "theRoom",
        members: [
          { member: "user1", voted: true, id: 1 },
          { member: "user2", voted: false, id: 2 }
        ]
      };

      expect(
        logReducer(initialState, {
          type: UPDATE_ROOM,
          payload: {
            user: "user2",
            roomId: 1,
            roomName: "theRoom",
            roomMembers: [
              { member: "user1", voted: true, id: 1 },
              { member: "user2", voted: false, id: 2 }
            ]
          }
        })
      ).toEqual(expected);
    });
  });

  describe("when receives an unknown action", () => {
    const initialState = {
      user: "test",
      roomId: 1,
      roomName: "newRoom",
      members: [{ member: "test", voted: false, id: 1 }]
    };
    it("should return the initial state", () => {
      expect(
        logReducer(initialState, {
          type: "UNKNOWN_ACTION",
          payload: { info: null }
        })
      ).toEqual(initialState);
    });
  });
});
