const signalR = require("@aspnet/signalr");
import StateStore from "./stores/stateStore";
import Run from "../src/index";

class Hub {
  constructor(props) {
    //super(props);
    this.state = {
      hubConnection: new signalR.HubConnectionBuilder()
        .withUrl("http://192.168.1.113:5000/chatHub")
        .build()
    };
    this.state.hubConnection
      .start()
      .then(() => console.log("Connection started!"))
      .catch(err => console.log(err));

    this.state.hubConnection.on("ReceiveVote", function(user, vote) {
      StateStore.addVote(user, vote);
      Run(StateStore.getState());
    });

    this.state.hubConnection.on("ReceiveMessage", function(user, message) {
      StateStore.state.chat.messages.push(message);
      Run(StateStore.getState());
    });

    this.state.hubConnection.on("FinishGame", function() {
      StateStore.endVote();
      Run(StateStore.getState());
    });

    this.state.hubConnection.on("ClearVotes", function() {
      StateStore.clearVotes();
      Run(StateStore.getState());
    });

    this.state.hubConnection.on("FlipVotes", function() {
      StateStore.flipVotes();
      Run(StateStore.getState());
    });

    this.state.hubConnection.on("JoinMember", function(members) {
      StateStore.addMember(members);
      console.log(StateStore.getState());
      Run(StateStore.getState());
    });
  }

  async createRoom() {
    const Id = await this.state.hubConnection.invoke("CreateRoom");
    StateStore.setRoomId(Id);
    await this.state.hubConnection.invoke(
      "HandleMember",
      StateStore.state.room.id,
      StateStore.state.room.userName
    );
    //Run(StateStore.getState());
  }

  async joinRoom() {
    this.state.hubConnection.invoke("JoinRoom", StateStore.state.room.id);
    await this.state.hubConnection.invoke(
      "HandleMember",
      StateStore.state.room.id,
      StateStore.state.room.userName
    );
    //Run(StateStore.getState());
  }

  handleVote(vote) {
    this.state.hubConnection.invoke(
      "SendVote",
      StateStore.state.room.userName,
      vote,
      StateStore.state.room.id,
      StateStore.state.history.story
    );
    //this.onHandleVote();
  }

  handleMessage(msg) {
    this.state.hubConnection.invoke(
      "SendMessage",
      StateStore.state.room.userName,
      msg,
      StateStore.state.room.id
    );
    //this.onHandleMessage();
  }

  handleControl(option) {
    switch (option) {
      case "1": {
        this.state.hubConnection.invoke("ClearVotes", StateStore.state.room.id);
        break;
        //this.onClearVotes();
      }
      case "2": {
        this.state.hubConnection.invoke(
          "FinishVoting",
          StateStore.state.room.id,
          StateStore.state.history.story
        );
        break;
        //this.onFinishVoting();
      }
      case "3": {
        this.state.hubConnection.invoke("ShowVotes", StateStore.state.room.id);
        break;
      }
    }
  }
}

const Connection = new Hub();
export default Connection;
