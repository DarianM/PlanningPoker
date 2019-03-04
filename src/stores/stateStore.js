import { Component } from "react";

class State extends Component {
  constructor() {
    super();
    this.state = {
      hasJoined: false,
      userError: false,
      room: {
        id: -1,
        userName: "",
        validUser: true
      },
      members: [],
      votes: {
        end: false,
        flip: false,
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

  addMember(members) {
    this.state.members = members;
  }

  addVote(user, vote) {
    this.state.votes.list.push({ user: user, voted: vote });
  }

  endVote() {
    this.state.votes.end = true;
  }

  clearVotes() {
    this.state.votes.list = [];
  }

  flipVotes() {
    this.state.votes.flip = true;
  }
}
const gameState = new State();

export default gameState;
