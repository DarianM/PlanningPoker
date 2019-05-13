const connectedSocket = require("./connectedSocket");

module.exports = class wsServer {
  constructor(server) {
    this._server = server;
    this._roomsSockets = {};
    this.clients = [];
  }

  addSocketToRoom(socket, roomId) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId] || [];
    this._roomsSockets[roomId].push(socket);
  }

  broadcast(roomId, data) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId] || [];
    this._roomsSockets[roomId].forEach(s => {
      s.send(data);
    });
  }

  disconnect(client, roomId) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId].filter(socket => socket !== client);
  }

  listen() {
    this._server.on("connection", (s, req) => {
      const roomId = req.url.substring(1);
      this.addSocketToRoom(s, roomId);
      this.clients.push(new connectedSocket(s, roomId, this));
    });
  }
};
