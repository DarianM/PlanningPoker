import { EventEmitter } from "events";

class State extends EventEmitter {
  constructor() {
    super();
    this.state = {
      hasJoined: false,
      userError: false,
      room: {
        id: -1,
        userName: ""
      },
      votes: {
        end: false,
        list: [{ user: "Trump", voted: "China" }]
      },
      history: {
        story: ""
      },
      chat: {
        messages: ["test"]
      }
    };
  }

  getState() {
    return this.state;
  }

  setRoomId(id) {
    this.state.room.id = id;
  }

  setUserName(user) {
    this.state.room.userName = user;
  }

  setStory(story) {
    this.state.history.story = story;
  }

  addVote(vote) {
    this.state.votes.list.push(vote);
  }
}
const gameState = new State();

export default gameState;
