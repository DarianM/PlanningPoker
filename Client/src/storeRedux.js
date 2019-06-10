/* eslint-disable no-underscore-dangle */
import { createStore, compose, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import websocketMiddleware from "./middleware/websocketMiddleware";
import messageMiddleware from "./middleware/messageMiddleware";

const initialStore = {
  gameRoom: {
    user: "",
    id: -1,
    roomName: "",
    hasJoined: false,
    members: []
  },
  stories: {
    byId: {},
    allIds: [],
    activeStoryId: undefined
  }
};

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  initialStore,
  storeEnhancers(applyMiddleware(thunk, websocketMiddleware, messageMiddleware))
);

export default store;
