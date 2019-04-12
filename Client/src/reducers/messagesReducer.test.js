import messagesReducer from "./messagesReducer";
import actions from "../actions/roomActions";

describe("messagesReducer", () => {
  describe("after creating/joining room chat is rendered", () => {
    const initialState = {
      nextId: 3,
      messages: [
        { message: "Hello...", user: "testUser", id: 1 },
        { message: "voted", user: "testUser", id: 2 }
      ]
    };
    it("should sends message in chat", () => {
      const expected = {
        nextId: 4,
        messages: [
          { message: "Hello...", user: "testUser", id: 1 },
          { message: "voted", user: "testUser", id: 2 },
          { message: "Hi there!", user: "Patrick", id: 3 }
        ]
      };

      expect(
        messagesReducer(
          initialState,
          actions.addMessage({ message: "Hi there!", user: "Patrick" })
        )
      ).toEqual(expected);
    });
  });

  describe("user picked a card during game", () => {
    describe("must inform members in chat that user has voted", () => {
      const initialState = {
        nextId: 2,
        messages: [{ message: "random message..", user: "Kevin", id: 1 }]
      };
      it("displays message voted!! along with user", () => {
        const expected = {
          nextId: 3,
          messages: [
            { message: "random message..", user: "Kevin", id: 1 },
            { message: "voted!!", user: "Mike", id: 2 }
          ]
        };

        expect(
          messagesReducer(initialState, actions.addVote({ user: "Mike" }))
        ).toEqual(expected);
      });
    });
  });
});
