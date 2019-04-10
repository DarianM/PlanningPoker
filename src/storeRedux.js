/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { signalRInvokeMiddleware, signalRRegisterCommands } from "./websocket";

const initialStore = {
  gameRoom: {
    user: "",
    id: -1,
    hasJoined: false,
    nextMemberId: 2,
    members: [{ member: "testUser", voted: true, id: 1 }],
    gameStart: null
  },
  gameHistory: {
    nextStoryId: 1,
    stories: [],
    activeStory: ""
  },
  chat: {
    nextId: 3,
    messages: [
      { message: "testMsg", user: "testUser", id: 1 },
      { message: "voted", user: "testUser", id: 2 }
    ]
  },
  gameVotes: {
    end: null,
    flip: false,
    nextVoteId: 2,
    list: [{ user: "testUser", voted: "1/3", id: 1 }]
  }
};

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initialStore,
  storeEnhancers(applyMiddleware(thunk, signalRInvokeMiddleware))
);

signalRRegisterCommands(store);
export default store;
