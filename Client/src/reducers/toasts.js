import { ADD_TOAST, REMOVE_TOAST } from "../actions/types";

const MAX_TOATS = 5;

export default function toasts(state = [], action) {
  const { payload, type } = action;
  switch (type) {
    case ADD_TOAST: {
      const toast = payload;
      return [...state.slice(1 - MAX_TOATS), toast];
    }

    case REMOVE_TOAST: {
      const { currentDate } = payload;
      return state.filter(t => t.expires > currentDate);
    }

    default:
      return state;
  }
}
