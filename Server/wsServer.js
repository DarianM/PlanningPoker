const connectedSocket = require("./connectedSocket");

module.exports = class wsServer {
  constructor(server) {
    this._server = server;
    this._roomsSockets = {};
    this.clients = [];
    this.interval = null;
  }

  addSocketToRoom(socket, roomId) {
    this._roomsSockets[roomId]
      ? this._roomsSockets[roomId].push(socket)
      : (this._roomsSockets[roomId] = [socket]);
  }

  broadcast(roomId, data) {
    this._roomsSockets[roomId] = this._roomsSockets[roomId] || [];
    this._roomsSockets[roomId].forEach(s => {
      if (s.readyState === 1) s.send(data);
    });
  }

  listen() {
    this._server.on("connection", (s, req) => {
      const roomId = req.url.substring(1);
      this.addSocketToRoom(s, roomId);
      const client = new connectedSocket(s, roomId, this);
      this.clients.push(client);

      this.interval = setTimeout(() => {
        this.clients.forEach(c => {
          c.ping();
        });
      }, 7000);
    });
  }
};
