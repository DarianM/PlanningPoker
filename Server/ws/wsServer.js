const fetch = require("node-fetch");
const connectedSocket = require("./connectedSocket");

module.exports = class wsServer {
  constructor(server) {
    this._server = server;
    this._roomsSockets = {};
    this._usersSockets = [];
    this.clients = [];
  }

  addSocketToRoom(socket, roomId) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId] || [];
    this._roomsSockets[roomId].push(socket);
  }

  mapUserToSocket(userId, socket) {
    this._usersSockets.push({ userId, socket });
  }

  broadcast(roomId, data) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId] || [];
    this._roomsSockets[roomId].forEach(s => {
      s.send(JSON.stringify(data));
    });
  }

  async fetchNormalClosure(socket, roomId) {
    const { userId } = this._usersSockets.find(user => user.socket === socket);
    this._usersSockets = this._usersSockets.filter(
      user => user.userId !== userId
    );
    await fetch(`http://localhost:3000/api/user/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ roomId })
    });
  }

  disconnect(client, roomId) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId].filter(
      socket => socket !== client
    );
  }

  decomposeUrl(url) {
    const separatorIndex = url.lastIndexOf("/");
    const roomId = url.substring(1, separatorIndex);
    const userId = url.substring(url.lastIndexOf("/") + 1);
    return { roomId, userId };
  }

  listen() {
    this._server.on("connection", (s, req) => {
      const { roomId, userId } = this.decomposeUrl(req.url);
      this.addSocketToRoom(s, roomId);
      this.mapUserToSocket(userId, s);
      this.clients.push(new connectedSocket(s, roomId, this));
    });
  }
};
