process.env.NODE_ENV = "test";
const ws = { on: jest.fn(), clients: [] };
require("ws").Server = jest.fn(() => ws);
const request = require("supertest");
const knex = require("../db/config");
const app = require("../app");

describe("Routes: Room", () => {
  beforeEach(() => {
    return knex.migrate.latest();
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe("/api/room route", () => {
    describe("creating a new room with a user name", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: "john" });
      });

      it("should return 200, memberId and roomId", () => {
        expect(result.statusCode).toBe(200);
        expect(typeof result.body.roomId).toBe("number");
        expect(typeof result.body.memberId).toBe("number");
      });
    });

    describe("creating a room without entering a username", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: "" });
      });

      it("should return 400", () => expect(result.statusCode).toBe(400));
    });

    describe("creating a room where username is of wrong type", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: 1234 });
      });

      it("should return 400", () => expect(result.statusCode).toBe(400));
    });

    describe("creating a room with blank room name", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: "test", roomName: "" });
      });
      it("should return room's name NewRoom", () =>
        expect(result.body.roomName).toBe("NewRoom"));
    });

    describe("creating a room with a chosen room name", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: "test", roomName: "myRoom" });
      });
      it("should return room's chosen name", () =>
        expect(result.body.roomName).toBe("myRoom"));
    });

    describe("creating a room with room name of wrong type", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/room")
          .send({ user: "test", roomName: true });
      });
      it("should return room's chosen name", () =>
        expect(result.statusCode).toBe(400));
    });
  });

  describe("/api/member route", () => {
    describe("joining a user in an existing room", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room")
          .send({ user: "test" });

        result = await request(app)
          .post("/api/member")
          .send({ user: "me", roomId: 1 });
      });
      it("should return 200 ", () => expect(result.statusCode).toBe(200));
    });
  });
});
