import * as SignalR from "@aspnet/signalr";
import * as types from "./actions/types";

const connection = new SignalR.HubConnectionBuilder()
  .withUrl("http://192.168.1.113:5000/chatHub")
  .build();
// connection.start();

export const signalRInvokeMiddleware = store => next => async action => {
  // switch (action.type) {
  //   case types.ASSIGN_ROOM: {
  //     const id = await this.state.hubConnection.invoke("CreateRoom");
  //     // return dispatch => {
  //     //   dispatch({
  //     //     type: "ASSIGN_ROOM",
  //     //     payload: { id }
  //     //   });
  //     // };
  //     return console.log(id);
  //   }
  //   default:
  //     break;
  // }
  if (action.type === "ASSIGN_ROOM") {
    const id = await connection.invoke("CreateRoom");
    console.log(id);
    return store.dispatch({
      type: types.SOCKET_ROOM_CREATED,
      payload: { ...action.payload, id }
    });
  }
  console.log("Middleware triggered:", action);
  return next(action);
};

export const signalRRegisterCommands = appStore => {
  // connection.on("UpdateMessages", data => {
  //   appStore.dispatch();
  // });
  connection.start();
};
// this.state.hubConnection.on("ReceiveVote", (user, vote) => {
//   StateStore.addVote(user, vote);
//   Run(StateStore.getState());
// });

// this.state.hubConnection.on("ReceiveMessage", (user, message) => {
//   StateStore.state.chat.messages.push(message);
//   Run(StateStore.getState());
// });

// this.state.hubConnection.on("FinishGame", () => {
//   StateStore.endVote();
//   Run(StateStore.getState());
// });

// this.state.hubConnection.on("ClearVotes", () => {
//   StateStore.clearVotes();
//   Run(StateStore.getState());
// });

// this.state.hubConnection.on("FlipVotes", () => {
//   StateStore.flipVotes();
//   Run(StateStore.getState());
// });

// this.state.hubConnection.on("JoinMember", members => {
//   StateStore.addMember(members);
//   // console.log(StateStore.getState());
//   Run(StateStore.getState());
// });

//   async createRoom() {
//     const id = await this.state.hubConnection.invoke("CreateRoom");
//     console.log(id);
//     return dispatch => {
//       dispatch({
//         type: "ASSIGN_ROOM",
//         payload: { id }
//       });
//     };
//     // StateStore.setRoomId(Id);
//     // await this.state.hubConnection.invoke(
//     //   'HandleMember',
//     //   StateStore.state.room.id,
//     //   StateStore.state.room.userName,
//     // );
//     // Run(StateStore.getState());
//   }

//   async joinRoom() {
//     this.state.hubConnection.invoke("JoinRoom", StateStore.state.room.id);
//     await this.state.hubConnection.invoke(
//       "HandleMember",
//       StateStore.state.room.id,
//       StateStore.state.room.userName
//     );
//     // Run(StateStore.getState());
//   }

//   handleVote(vote) {
//     this.state.hubConnection.invoke(
//       "SendVote",
//       StateStore.state.room.userName,
//       vote,
//       StateStore.state.room.id,
//       StateStore.state.history.story
//     );
//     // this.onHandleVote();
//   }

//   handleMessage(msg) {
//     this.state.hubConnection.invoke(
//       "SendMessage",
//       StateStore.state.room.userName,
//       msg,
//       StateStore.state.room.id
//     );
//     // this.onHandleMessage();
//   }

//   // handleControl(option) {
//   //   switch (option) {
//   //     case '1': {
//   //       this.state.hubConnection.invoke('ClearVotes', StateStore.state.room.id);
//   //       break;
//   //       // this.onClearVotes();
//   //     }
//   //     case '2': {
//   //       this.state.hubConnection.invoke(
//   //         'FinishVoting',
//   //         StateStore.state.room.id,
//   //         StateStore.state.history.story,
//   //       );
//   //       break;
//   //       // this.onFinishVoting();
//   //     }
//   //     case '3': {
//   //       this.state.hubConnection.invoke('ShowVotes', StateStore.state.room.id);
//   //       break;
//   //     }
//   //   }
//   // }

// // const Connection = new Hub();
// // export default Connection;
