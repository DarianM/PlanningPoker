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
  send: jest.fn(),
  onmessage: jest.fn(),
  onclose: jest.fn(),
  onerror: jest.fn(),
  isAlive: true,
  readyState: 1
};
const incomingMessage = { url: "/1" };

describe("websocket server", () => {
  describe("on connection", () => {
    const cbFunc = wss.on.mock.calls[0][1];
    it("test", () => {
      expect(cbFunc(socket, incomingMessage)).not.toBeNull();
    });
  });
});

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
        socket.send.mockReset();
        await request(app)
          .post("/api/room")
          .send({ user: "test" });

        result = await request(app)
          .post("/api/member")
          .send({ user: "me", roomId: 1 });
      });
      it("should return 200", () => {
        expect(result.statusCode).toBe(200);
      });
      it("should notify other users about the newcomer", () => {
        expect(socket.send).toHaveBeenCalledWith(
          JSON.stringify({
            reason: "USER_JOINED",
            data: { user: "me", userId: result.body.userId }
          })
        );
      });
    });
    describe("use wrong type", () => {
      describe("for room id", () => {
        let result;
        beforeEach(async () => {
          await request(app)
            .post("/api/room")
            .send({ user: "one" });
          result = await request(app)
            .post("/api/member")
            .send({ user: "test", roomId: "x" });
        });
        it("should return 400", () => {
          expect(result.statusCode).toBe(400);
          expect(result.body.error).toBe("wrong type");
        });
      });
      describe("for username", () => {
        let result;
        beforeEach(async () => {
          await request(app)
            .post("/api/room")
            .send({ user: "one" });
          result = await request(app)
            .post("/api/member")
            .send({ user: 99, roomId: 1 });
        });
        it("should return 400", () => {
          expect(result.statusCode).toBe(400);
          expect(result.body.error).toBe("wrong type");
        });
      });
    });
    describe("join a user in a non existing room", () => {
      let result;
      beforeEach(async () => {
        result = await request(app)
          .post("/api/member")
          .send({ user: "test", roomId: 2 });
      });
      it("should return 400 - room not available", () => {
        expect(result.statusCode).toBe(400);
        expect(result.body.error).toBe("Room not available");
      });
    });
    describe("join a user in a room where another user with the same name already exists", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room")
          .send({ user: "test" });
        result = await request(app)
          .post("/api/member")
          .send({ user: "test", roomId: 1 });
      });
      it("should return 400 - name conflict", () => {
        expect(result.statusCode).toBe(400);
        expect(result.body.error).toBe(
          "A user with the same name already exists in the room"
        );
      });
    });
  });

  describe("/api/:roomId route", () => {
    describe("get members from a room", () => {
      let result;
      beforeEach(async () => {
        await request(app)
          .post("/api/room")
          .send({ user: "test" });
        result = await request(app).get("/api/1");
      });
      it("should return room's members list and status 200", () => {
        expect(result.body.members).toContainEqual({ member: "test", id: 1 });
        expect(result.body.roomName).toBe("NewRoom");
        expect(result.statusCode).toBe(200);
      });
    });
    describe("room with desired id does not exist", () => {
      let result;
      beforeEach(async () => {
        result = await request(app).get("/api/1");
      });
      it("should return 400 and error", () => {
        expect(result.body.error).toBe("Room not available");
        expect(result.statusCode).toBe(400);
      });
    });
    describe("room id is of wrong type", () => {
      let result;
      beforeEach(async () => {
        result = await request(app).get("/api/VI");
      });
      it("should return 400", () => {
        expect(result.statusCode).toBe(400);
        expect(result.body.error).toBe("wrong type");
      });
    });
  });

  describe("/api/votes/:roomId route", () => {
    let result;
    beforeEach(async () => {
      result = await request(app).get("/api/votes/1");
    });
    it("should return votes", () => {});
  });
});
