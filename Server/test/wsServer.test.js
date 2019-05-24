const wsServer = require("../ws/wsServer");

const wss = {
  on: jest.fn(),
  clients: [
    { isAlive: true, terminate: jest.fn() },
    { isAlive: false, terminate: jest.fn() }
  ],
  options: { host: "testhost", port: "0000" }
};
const socket = {
  on: jest.fn(),
  send: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(),
  onerror: jest.fn(),
  isAlive: true,
  readyState: 1
};

describe("websocket server", () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  describe("starting listening", () => {
    const server = new wsServer(wss);
    server.listen();
    const cbFunc = wss.on.mock.calls[0][1];
    it("server 'on' method should be called", () => {
      expect(wss.on).toHaveBeenCalledWith("connection", cbFunc);
    });
    describe("new socket connects", () => {
      cbFunc(socket, { url: "/1" });
      it("should add the new socket in the roomsSockets object", () => {
        expect(server._roomsSockets).toEqual({ 1: [socket] });
      });
    });
  });

  describe("broadcasting", () => {
    const server = new wsServer(wss);
    server._roomsSockets = { 1: [socket, socket] };
    server.broadcast(1, { voted: "1/2" });

    it("should broadcast message to all sockets", () => {
      expect(socket.send).toHaveBeenCalledTimes(2);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({ voted: "1/2" })
      );
    });
  });

  describe("disconnect", () => {
    const server = new wsServer(wss);
    const terminatedSocket = { terminated: jest.fn() };
    server._roomsSockets = { 1: [socket, terminatedSocket] };
    const roomId = 1;

    server.disconnect(terminatedSocket, roomId);
    it("should remove terminated socket from room", () => {
      expect(server._roomsSockets[1]).toEqual([socket]);
    });
  });
});
