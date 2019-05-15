const wsServer = require("../wsServer");
const connectedSocket = require("../connectedSocket");
// jest.mock("../connectedSocket");

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
  // beforeEach(() => connectedSocket.mockClear());

  const server = new wsServer(wss);
  describe("starting listening", () => {
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
});
