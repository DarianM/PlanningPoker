import { ADD_TOAST, REMOVE_TOAST } from "../actions/types";

export default function toasts(state = [], action) {
  const { payload, id, type } = action;
  switch (type) {
    case ADD_TOAST: {
      const toast = { ...payload, id };
      return [...state, toast]; // [toast];
    }

    case REMOVE_TOAST:
      return state.filter(toast => toast.id !== payload);

    default:
      return state;
  }
}
