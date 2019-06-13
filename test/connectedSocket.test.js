const connectedSocket = require("../ws/connectedSocket");

const socket = {
  on: jest.fn(),
  send: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(e => e),
  onerror: jest.fn(),
  ping: jest.fn(),
  terminate: jest.fn()
};

const wsServer = {
  disconnect: jest.fn(),
  broadcast: jest.fn(),
  fetchNormalClosure: jest.fn()
};

describe("connected socket", () => {
  beforeAll(() => jest.useFakeTimers());
  afterAll(() => jest.useRealTimers());

  const roomId = 1;
  it("should schedule ping to client socket", () => {
    const clientSocket = new connectedSocket(socket, roomId, wsServer);
    jest.runOnlyPendingTimers();

    expect(clientSocket.socket.ping).toHaveBeenCalledWith("ping");
  });

  describe("client socket doesn't respond back with pong", () => {
    it("should disconnect the socket on next interval", () => {
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      expect(socket.terminate).toHaveBeenCalled();
    });
    it("should terminate the socket on next interval", () => {
      jest.runOnlyPendingTimers();
      jest.runOnlyPendingTimers();
      expect(wsServer.disconnect).toHaveBeenCalled();
    });
  });

  describe("on received message", () => {
    it("should broadcast message to other sockets", () => {
      const clientSocket = new connectedSocket(socket, roomId, wsServer);
      const onMsgCbFunc = socket.on.mock.calls[1][1];
      onMsgCbFunc(
        JSON.stringify({ reason: "USER_VOTED", data: "some info..." })
      );
      expect(clientSocket.server.broadcast).toHaveBeenCalled();
    });
  });

  describe("on close", () => {
    const clientSocket = new connectedSocket(socket, roomId, wsServer);
    clientSocket.clearPing = jest.fn();
    const onCloseCbFunc = socket.on.mock.calls[2][1];
    it("should close socket and clear ping-pong interval", () => {
      expect(clientSocket.socket.terminate).toHaveBeenCalled();
      expect(clientSocket.clearPing).toHaveBeenCalled();
    });
    describe("normal", () => {
      onCloseCbFunc(1001);
      it("should disconnect from server and notify the normal closure", () => {
        expect(clientSocket.server.disconnect).toHaveBeenCalled();
        expect(clientSocket.server.fetchNormalClosure).toHaveBeenCalled();
      });
    });
    describe("abnormal", () => {
      onCloseCbFunc(1006);
      it("should only disconnect from server", () => {
        expect(clientSocket.server.disconnect).toHaveBeenCalled();
      });
    });
  });
});
