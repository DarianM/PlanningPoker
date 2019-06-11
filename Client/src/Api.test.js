import Api from "./Api";

describe("with server ok", () => {
  const POST = "POST";
  const url = "http:fake.com";
  const mockFetch = () =>
    new Promise((resolve, reject) =>
      resolve({
        json: () => ({
          roomName: "randomName",
          user: "name"
        }),
        ok: true
      })
    );
  it("should return some data", async () => {
    const result = await Api(POST, url, {}, mockFetch);
    expect(result).toEqual({ user: "name", roomName: "randomName" });
  });
});

describe("with data validation error from server", () => {
  const url = "http:fake.com";
  const mockFetch = jest.fn(
    () =>
      new Promise((resolve, reject) =>
        resolve({
          json: () => ({
            error: { message: "this from server..." }
          }),
          status: 400,
          ok: false
        })
      )
  );
  it("should throw error message", async () => {
    await expect(
      Api("POST", url, { user: "random", roomName: "room" }, mockFetch)
    ).rejects.toThrow();
  });
});

describe("with not working server", () => {
  const url = "http:fake.com";
  const mockFetch = jest.fn(() => new Promise((resolve, reject) => reject()));
  it("should enter in catch", async () => {
    await expect(
      Api("POST", url, { user: "random", roomName: "room" }, mockFetch)
    ).rejects.toThrowError("Check your internet connection");
  });
});
