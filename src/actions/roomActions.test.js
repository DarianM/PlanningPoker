import actions from "./roomActions";

// describe("actions room", () => {
//   test("Login", () => {
//     const payload = {
//       user: "some random name"
//     };
//     const loginFn = actions.login(payload);
//     const dispatch = jest.fn();
//     loginFn(dispatch);
//     expect(dispatch).toHaveBeenCalledWith({
//       type: "ASSIGN_ROOM",
//       payload: { user: payload, hasJoined: true }
//     });
//   });
// });

describe("actions room", () => {
  test("Login", () => {
    const payload = {
      user: "some random name"
    };
    const loginFn = actions.login(payload);
    loginFn(receivedAction => {
      expect(receivedAction).toContain({
        type: "ASSIGN_ROOM",
        payload: { user: payload.user, hasJoined: true }
      });
    });
  });
});
