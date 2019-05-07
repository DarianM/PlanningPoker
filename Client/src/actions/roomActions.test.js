import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import actions from "./roomActions";

describe("actions creators", () => {
  describe("create a session when your network is offline", () => {
    global.fetch = jest.fn(
      () =>
        new Promise(
          (resolve, reject) =>
            resolve({
              json: () => ({
                roomName: "randomName",
                ok: false
              })
            })
          // reject(new Error("this shitty msg"))
        )
    );
    it("should error message with check internet...", async () => {
      const result = actions.createRoom({ user: "random", roomName: "room" });
      const dispatch = param => {
        console.log(param);
      };
      result(dispatch);
      // expect(typeof result).toBe("function");
    });
  });

  describe("actions creators 2.0", () => {
    global.fetch = jest.fn(
      () =>
        new Promise(
          (resolve, reject) =>
            resolve({
              ok: true,
              socket: () => "test",
              json: () => ({
                roomName: "randomName"
              })
            })
          // reject(new Error("this shitty msg"))
        )
    );
    it("should error message with check internet...", async () => {
      const result = actions.createRoom({ user: "random", roomName: "room" });
      const dispatch = param => {
        console.log(param);
      };
      result(dispatch);
      // expect(typeof result).toBe("function");
    });
  });
});
