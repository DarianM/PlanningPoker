const ws = require("ws").Server;

const wss = new ws({ port: process.env.PORT });
const wsServer = require("./wsServer");

const server = new wsServer(wss);
server.listen();

module.exports = server;
