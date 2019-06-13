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

describe("/api/room route", () => {
  beforeEach(() => {
    return knex.migrate.latest();
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe("creating a new room with a valid user name", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/create")
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
        .post("/api/room/create")
        .send({ user: "" });
    });

    it("should return 400", () => expect(result.statusCode).toBe(400));
  });

  describe("creating a room where username is of wrong type", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/create")
        .send({ user: 1234 });
    });

    it("should return 400", () => expect(result.statusCode).toBe(400));
  });

  describe("creating a room with blank room name", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/create")
        .send({ user: "test", roomName: "" });
    });
    it("should return room's name NewRoom", () =>
      expect(result.body.roomName).toBe("NewRoom"));
  });

  describe("creating a room with a chosen room name", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/create")
        .send({ user: "test", roomName: "myRoom" });
    });
    it("should return room's chosen name", () =>
      expect(result.body.roomName).toBe("myRoom"));
  });

  describe("creating a room with room name of wrong type", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/create")
        .send({ user: "test", roomName: true });
    });
    it("should return room's chosen name", () =>
      expect(result.statusCode).toBe(400));
  });

  describe("joining a user in an existing room", () => {
    let result;
    beforeEach(async () => {
      socket.send.mockReset();
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });

      result = await request(app)
        .post("/api/room/join")
        .send({ user: "meee", roomId: 1 });
    });
    it("should return 200", () => {
      expect(result.statusCode).toBe(200);
    });
    it("should notify other users about the newcomer", () => {
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          reason: "USER_JOINED",
          data: { user: "meee", userId: result.body.roomInfo.userId }
        })
      );
    });
  });
  describe("use wrong type", () => {
    describe("for room id", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room/create")
          .send({ user: "one" });
        result = await request(app)
          .post("/api/room/join")
          .send({ user: "test", roomId: "x" });
      });
      it("should return 400", () => {
        expect(result.statusCode).toBe(400);
        expect(result.body.error).toEqual([
          { location: "roomId", message: "Please provide a valid room id" }
        ]);
      });
    });
    describe("for username", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room/create")
          .send({ user: "one" });
        result = await request(app)
          .post("/api/room/join")
          .send({ user: 99, roomId: 1 });
      });
      it("should return 400", () => {
        expect(result.statusCode).toBe(400);
        expect(result.body.error).toEqual([
          { location: "user", message: "Please insert a valid username" }
        ]);
      });
    });
  });
  describe("join a user in a non existing room", () => {
    let result;
    beforeEach(async () => {
      result = await request(app)
        .post("/api/room/join")
        .send({ user: "test", roomId: 2 });
    });
    it("should return 400 - room not available", () => {
      expect(result.statusCode).toBe(400);
      expect(result.body.error).toEqual([
        { location: "roomId", message: "Room not available" }
      ]);
    });
  });
  describe("join a user in a room where another user with the same name already exists", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .post("/api/room/join")
        .send({ user: "test", roomId: 1 });
    });
    it("should return 400 - name conflict", () => {
      expect(result.statusCode).toBe(400);
      expect(result.body.error).toEqual([
        {
          location: "user",
          message: "A user with the same name already exists in the room"
        }
      ]);
    });
  });
  describe("get members from a room", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app).get("/api/room/1");
    });
    it("should return room's members list and status 200", () => {
      const { roomMembers } = result.body;
      expect(roomMembers).toContainEqual({
        member: "test",
        voted: null,
        id: 1
      });
      expect(result.body.roomName).toBe("NewRoom");
      expect(result.statusCode).toBe(200);
    });
  });
  describe("room with desired id does not exist", () => {
    let result;
    beforeEach(async () => {
      result = await request(app).get("/api/room/1");
    });
    it("should return 400 and error", () => {
      expect(result.body.error).toBe("Room not available");
      expect(result.statusCode).toBe(400);
    });
  });
  describe("room id is of wrong type", () => {
    let result;
    beforeEach(async () => {
      result = await request(app).get("/api/room/VI");
    });
    it("should return 400", () => {
      expect(result.statusCode).toBe(400);
      expect(result.body.error).toEqual([
        { location: "roomId", message: "Please provide a valid room id" }
      ]);
    });
  });

  describe("rename room", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      result = await request(app)
        .put("/api/room/rename/1")
        .send({ roomName: "room name edited" });
    });
    it("should update room's name", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenCalledWith(
        JSON.stringify({
          reason: "ROOM_NAME_UPDATED",
          data: { roomName: "room name edited" }
        })
      );
    });
  });

  describe("force flip", () => {
    let result;
    beforeEach(async () => {
      await request(app)
        .post("/api/room/create")
        .send({ user: "test" });
      await request(app)
        .put("/api/story/add")
        .send({ story: "new story", roomId: 1, active: true });
      await request(app)
        .post("/api/vote")
        .send({ user: "test", storyId: 1, roomId: 1, value: "8" });
      result = await request(app).put("/api/room/forceflip/1");
    });
    it("should return the votes and broadcast", () => {
      expect(result.statusCode).toBe(200);
      expect(socket.send).toHaveBeenLastCalledWith(
        JSON.stringify({
          reason: "FLIP_CARDS",
          data: { votes: [{ id: 1, name: "test", vote: "8" }] }
        })
      );
    });
  });
});
