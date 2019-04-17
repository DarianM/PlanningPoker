const request = require("supertest");
const app = require("../app");

describe("Test the root path", () => {
  it("Hello API Request", async () => {
    const result = await request(app).get("/api");
    expect(result.body).toEqual({
      message: "Hello. You are @ localhost:3000/api"
    });
    expect(result.statusCode).toEqual(200);
  });
});
