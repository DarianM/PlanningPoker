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
  it("should throw exception", async () => {
    const result = await Api(POST, url, {}, mockFetch);
    expect(result).toEqual({ user: "name", roomName: "randomName" });
  });
});

describe("with error from server", () => {
  const url = "http:fake.com";
  const mockFetch = jest.fn(
    () =>
      new Promise((resolve, reject) =>
        resolve({
          json: () => ({
            error: "this from server..."
          }),
          status: 400,
          ok: false
        })
      )
  );
  it("should throw error message", () => {
    const result = Api(url, { user: "random", roomName: "room" }, mockFetch);
    expect(result).rejects.toThrowError();
    expect(result).rejects.toEqual("this from server...");
  });
});
