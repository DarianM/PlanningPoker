import { addToast, removeToast } from "./toastsActions";
import { ADD_TOAST, REMOVE_TOAST } from "./types";

describe("toasts action creators", () => {
  beforeAll(() => {
    jest.useFakeTimers();
    Date.now = jest.fn(() => new Date("2019-04-09T11:05:20").valueOf());
  });

  afterAll(() => {
    jest.useRealTimers();
    Date.now = global.Date.now();
  });

  describe("add toast", () => {
    it("should return action with type ADD_TOAST", () => {
      expect(addToast({ text: "toast wanna be" })).toEqual({
        payload: { expires: Date.now() + 3000, text: "toast wanna be" },
        type: ADD_TOAST
      });
    });
  });
  describe("remove toast", () => {
    it("should return action with type REMOVE_TOAST", () => {
      expect(removeToast()).toEqual({
        payload: { currentDate: Date.now() },
        type: REMOVE_TOAST
      });
    });
  });
});
