import actions from "./roomActions";
import { LOGIN_FAILURE } from "./types";
import { addToast } from "./toastsActions";

describe("actions creators", () => {
  describe("create a session when your network is offline", () => {
    global.fetch = jest.fn(
      () => new Promise((resolve, reject) => reject(new Error("error")))
    );
    it("should error message with check internet...", async () => {
      const result = actions.createRoom({ user: "random", roomName: "room" });
      const dispatch = jest.fn();
      await result(dispatch);
      expect(dispatch.mock.calls).toContainEqual([
        {
          type: "LOGIN_FAILURE"
        }
      ]);
    });
  });
  // describe("create a session when server is offline", () => {
  //   global.fetch = jest.fn(
  //     () =>
  //       new Promise(resolve => {
  //         resolve({ ok: false });
  //       })
  //   );
  //   it("should error message server offline", async () => {
  //     const result = actions.createRoom({ user: "random", roomName: "room" });
  //     const dispatch = param => {
  //       expect(param).toBeCalledWith(addToast({ text: "Server offline..." }));
  //       expect(param).toBeCalledWith({ type: LOGIN_FAILURE });
  //     };
  //     result(dispatch);
  //   });
  // });
});

//   describe("actions creators 2.0", () => {
//     global.fetch = jest.fn(
//       () =>
//         new Promise(
//           (resolve, reject) =>
//             resolve({
//               ok: true,
//               socket: () => "test",
//               json: () => ({
//                 roomName: "randomName"
//               })
//             })
//           // reject(new Error("this shitty msg"))
//         )
//     );
//     it("should error message with check internet...", async () => {
//       const result = actions.createRoom({ user: "random", roomName: "room" });
//       const dispatch = param => {
//         console.log(param);
//       };
//       result(dispatch);
//       // expect(typeof result).toBe("function");
//     });
//   });
// });
