process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
const knex = require("../db/config");

describe("Routes: Room", () => {
  beforeAll(() => {
    return knex.migrate.latest();
  });

  afterAll(() => {
    return knex.migrate.rollback();
  });

  describe("/api/room route", () => {
    describe("when creating a new room", () => {
      let result;
      beforeEach(async () => {
        result = await request(app).post("/api");
      });

      it("should return 200", () => expect(result.statusCode).toBe(200));

      it("should return the new room id", () =>
        expect(typeof result.body.roomId).toBe("number"));
    });
  });
});
