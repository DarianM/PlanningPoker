process.env.NODE_ENV = "test";
const wss = {
  on: jest.fn(),
  clients: [],
  options: { host: "testhost", port: "0000" }
};
require("ws").Server = jest.fn(() => wss);
const request = require("supertest");
const knex = require("../db/config");
const app = require("../app");

const socket = {
  on: jest.fn(),
  ping: jest.fn(),
  send: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(),
  onerror: jest.fn(),
  terminate: jest.fn(),
  isAlive: true,
  readyState: 1
};
const incomingMessage = { url: "/1/2" };

describe("websocket server", () => {
  describe("on connection", () => {
    const cbFunc = wss.on.mock.calls[0][1];
    cbFunc(socket, incomingMessage);
    it("test", () => {
      const onMessage = socket.on.mock.calls[1][1];
      onMessage(JSON.stringify({ reason: "USER_VOTED", data: { vote: 2 } }));
      expect(socket.send).toHaveBeenCalled();
    });
  });
});

describe("Route: /api", () => {
  beforeEach(() => {
    return knex.migrate.latest();
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe("/api/vote route", () => {
    describe("providing a valid vote", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room/create")
          .send({ user: "test" });
        result = await request(app)
          .post("/api/vote")
          .send({ user: "test", storyId: 1, roomId: 1, value: "20" });
      });
      it("should return 200 and broadcast the vote", () => {
        expect(result.statusCode).toBe(200);

        const cbFunc = wss.on.mock.calls[0][1];
        cbFunc(socket, incomingMessage);
        const onMessage = socket.on.mock.calls[1][1];
        onMessage(
          JSON.stringify({
            reason: "USER_VOTED",
            data: { vote: 3 }
          })
        );
        expect(socket.send).toHaveBeenCalled();
        expect(result.body).toEqual({});
      });
    });
    describe("providing an invalid vote", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room/create")
          .send({ user: "test" });
        result = await request(app)
          .post("/api/vote")
          .send({ user: "test", roomId: 1, voted: "33" });
      });
      it("should return 400, wrong type", () => {
        expect(result.statusCode).toBe(400);
      });
    });
  });

  describe("/api/user/:userId delete route", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .post("/api/room/join")
        .send({ user: "test2", roomId: 1 });
      result = await request(app)
        .delete("/api/user/2")
        .send({ roomId: 1, userId: 2 });
    });

    it("should remove the user from the room", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({ reason: "USER_LEFT", data: { name: "test2" } })
      );
    });
  });

  describe("/api/votes/:roomId delete route", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .delete("/api/votes/1")
        .send({ roomId: 1 });
    });
    it("should delete votes", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({ reason: "CLEAR_VOTES" })
      );
    });
  });
});
