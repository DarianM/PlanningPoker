const wsServer = require("../wsServer");

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

  const server = new wsServer(wss);
  describe("starting listening", () => {
    server.listen();
    it("server 'on' method should be called", () => {
      const cbFunc = wss.on.mock.calls[0][1];
      expect(wss.on).toHaveBeenCalledWith("connection", cbFunc);
      cbFunc(socket, { url: "/1" });
      expect(server._roomsSockets).toEqual({ 1: [socket] });
    });
  });
});
