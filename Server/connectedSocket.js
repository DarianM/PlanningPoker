module.exports = class connectedSocket {
  constructor(socket, roomId, server) {
    this.socket = socket;
    this.server = server;
    this.roomId = roomId;
    this.isAlive = true;
    socket.on("pong", () => this.pong());
    socket.on("message", event => this.onmessage(event.data));
    socket.on("close", () => this.onclose());
    socket.on("error", err => console.log(err));
  }
  onmessage(message) {
    this.broadcastMessage(JSON.parse(message));
  }

  ping() {
    if (!this.isAlive) {
      this.socket.terminate();
    }
    this.isAlive = false;
    this.socket.ping("ping");
  }
  terminate() {
    this.socket.terminate();
  }

  onclose() {
    this.server._roomsSockets[this.roomId] = this.server._roomsSockets[
      this.roomId
    ].filter(socket => socket !== this.socket);
    this.terminate();
    clearInterval(this.server.interval);
  }
  pong() {
    this.isAlive = true;
  }
  broadcastMessage(message) {
    if (message === "ping") return;
    const { data } = message;
    switch (message.action) {
      case "USER_VOTED":
        this.server.broadcast(this.roomId, data);
        break;
      default:
        break;
    }
  }
};
