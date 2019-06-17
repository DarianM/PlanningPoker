process.env.NODE_ENV = "test";
const broadcast = jest.fn((roomId, data) => socket.send(JSON.stringify(data)));
require("../ws/wsServerConfig").server = { broadcast };
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

describe("Route: /api", () => {
  beforeEach(() => {
    broadcast.mockClear();
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
        expect(broadcast).toHaveBeenCalledWith(1, {
          reason: "USER_VOTED",
          data: { id: 1, user: "test", value: "20" }
        });
        expect(socket.send).toHaveBeenCalled();
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
        expect(broadcast).not.toHaveBeenCalled();
      });
    });
  });

  describe("/api/votes/:roomId delete route", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app).delete("/api/votes/1");
    });
    it("should delete votes", () => {
      expect(result.statusCode).toBe(200);
      expect(broadcast).toHaveBeenCalled();
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({ reason: "CLEAR_VOTES" })
      );
    });
  });
});
