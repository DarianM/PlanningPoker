import React from "react";
import { mount } from "enzyme";
import { Modal, ConnectedToasts } from "./modals";

describe("Modal components", () => {
  it("renders a modal without crashing", () => {
    const text = <div>I am a text that wanna be displayed in a modal</div>;
    mount(<Modal>{text}</Modal>);
  });

  describe("Toasts", () => {
    beforeAll(() => {
      jest.useFakeTimers();
    });

    afterAll(() => {
      jest.useRealTimers();
    });
    const actions = { removeToast: jest.fn() };

    it("renders a toast without crashing", () => {
      const toasts = [{ expires: Date.now(), text: "for toast" }];
      mount(<ConnectedToasts actions={actions} toasts={toasts} />);
    });

    describe("while toasts add up in the array", () => {
      const wrapper = mount(<ConnectedToasts actions={actions} toasts={[]} />);
      it("should start clearing toasts that are expiring", () => {
        expect(wrapper.instance().checkInterval).toBe(undefined);

        const toasts = [
          { expires: Date.now(), text: "first toast" },
          { expires: Date.now() + 1000, text: "second" },
          { expires: Date.now() + 2000, text: "third" }
        ];
        wrapper.setProps({ toasts });
        expect(wrapper.instance().checkInterval).not.toBe(undefined);

        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);
        expect(actions.removeToast).toHaveBeenCalledTimes(3);
      });
      it("should stop clearing toasts while there aren't any left", () => {
        expect(wrapper.instance().checkInterval).not.toBe(undefined);
        wrapper.setProps({ toasts: [] });
        expect(wrapper.instance().checkInterval).toBe(0);
      });
    });
  });
});
