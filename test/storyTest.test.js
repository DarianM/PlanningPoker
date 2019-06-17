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

// describe("websocket server", () => {
//   describe("on connection", () => {
//     const cbFunc = wss.on.mock.calls[0][1];
//     cbFunc(socket, incomingMessage);
//     it("test", () => {
//       const onMessage = socket.on.mock.calls[1][1];
//       onMessage(JSON.stringify({ reason: "USER_VOTED", data: { vote: 2 } }));
//       expect(socket.send).toHaveBeenCalled();
//     });
//   });
// });

describe("Route: /api/story", () => {
  beforeEach(() => {
    return knex.migrate.latest();
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe("starting a story with a valid date", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .post("/api/story/add")
        .send({ story: "test", roomId: 1 });
      result = await request(app)
        .post("/api/story/start")
        .send({ date: "2019-05-22T07:41:17.882Z", storyId: 1, roomId: 1 });
    });
    it("should return 200 and broadcast game start", () => {
      expect(result.statusCode).toBe(200);
      expect(broadcast).toHaveBeenCalledWith(1, {
        reason: "STORY_STARTED",
        data: { date: "2019-05-22T07:41:17.882Z" }
      });
      expect(socket.send).toHaveBeenCalled();
    });
  });
  describe("starting a story with an invalid date", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .post("/api/story/start")
        .send({ date: "2019-05-35", roomId: 1 });
    });
    it("should return 400, wrong type", () => {
      expect(result.statusCode).toBe(400);
      expect(result.body.error).toEqual([
        { location: "date", message: "wrong date" }
      ]);
    });
  });

  describe("adding a valid story", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .post("/api/story/add")
        .send({ story: "new story", roomId: 1, active: true });
    });
    it("should return 200", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          reason: "NEW_STORY",
          data: { story: "new story", id: 1 }
        })
      );
    });
  });

  describe("adding an invalid story", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .post("/api/story/add")
        .send({ story: "ne", roomId: 1, active: true });
    });
    it("should return 400", () => {
      expect(result.statusCode).toBe(400);
      expect(result.body.error).toEqual([
        {
          location: "story",
          message: "Story description must have between 5-40 characters"
        }
      ]);
    });
  });

  describe("renaming an existing story", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .post("/api/story/add")
        .send({ story: "new story", roomId: 1, active: true });
      result = await request(app)
        .put("/api/story/rename")
        .send({ story: "new story edited", storyId: 1, roomId: 1 });
    });
    it("should change the name of the desired story", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          reason: "STORY_RENAMED",
          data: { description: "new story edited", id: 1 }
        })
      );
    });
  });

  describe("renaming an inexisting story", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .post("/api/story/add")
        .send({ story: "new story", roomId: 1, active: true });
      result = await request(app)
        .put("/api/story/rename")
        .send({ story: "new story edited", storyId: 3456, roomId: 1 });
    });
    it("should return 404", () => {
      expect(result.statusCode).toBe(404);
    });
  });

  describe("ending an existing story", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .post("/api/story/add")
        .send({ story: "new story", roomId: 1, active: true });
      result = await request(app)
        .post("/api/story/end")
        .send({ date: "2019-05-22T07:41:17.882Z", roomId: 1, storyId: 1 });
    });
    it("should end story", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          reason: "STORY_ENDED",
          data: { date: "2019-05-22T07:41:17.882Z" }
        })
      );
    });
  });
});
