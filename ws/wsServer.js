const nodeFetch = require("node-fetch");
const connectedSocket = require("./connectedSocket");
const { getUserById, deleteUser } = require("../db/db_utils");

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
    const { name } = await getUserById(userId);
    await deleteUser(userId);
    this.broadcast(roomId, { reason: "USER_LEFT", data: { name } });
  }

  disconnect(client, roomId) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId].filter(
      socket => socket !== client
    );
  }

  decomposeUrl(url) {
    const regex = /\/ws\/(\d{1,5})\/(\d{1,5})/;
    const match = regex.exec(url);
    const roomId = match[1];
    const userId = match[2];
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
