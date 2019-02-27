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
        list: ["4"]
      },
      history: {
        story: ""
      },
      chat: {
        messages: [""]
      }
    };
  }

  getState() {
    return this.state;
  }
}
const gameState = new State();

export default gameState;
