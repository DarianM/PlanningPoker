import { Component } from "react";
const signalR = require("@aspnet/signalr");
import StateStore from "./stores/stateStore";
import Run from "../src/index";

class Hub extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://192.168.1.113:5000/chatHub")
        .build()
    };
    this.state.hubConnection
      .start()
      .then(() => console.log("Connection started!"))
      .catch(err => console.log(err));
  }

  onHandleVote() {
    this.state.hubConnection.on("ReceiveVote", function(user, vote) {
      StateStore.state.votes.list.push({ user: user, voted: vote });
      console.log(StateStore.state);
      Run(StateStore.getState());
    });
  }

  onHandleMessage() {
    this.state.hubConnection.on("ReceiveMessage", function(user, message) {
      StateStore.state.chat.messages.push(message);
      Run(StateStore.getState());
    });
  }

  async createRoom() {
    const Id = await this.state.hubConnection.invoke("CreateRoom");
    StateStore.setRoomId(Id);
    Run(StateStore.getState());
  }

  joinRoom(id) {
    this.state.hubConnection.invoke("JoinRoom", id);
  }

  handleVote(vote) {
    this.state.hubConnection.invoke(
      "SendVote",
      StateStore.state.room.userName,
      vote,
      StateStore.state.room.id,
      StateStore.state.history.story
    );
    this.onHandleVote();
  }

  handleMessage(msg) {
    this.state.hubConnection.invoke(
      "SendMessage",
      StateStore.state.room.userName,
      msg,
      StateStore.state.room.id
    );
    this.onHandleMessage();
  }
}

const Connection = new Hub();
export default Connection;
