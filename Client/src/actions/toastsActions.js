import { ADD_TOAST, REMOVE_TOAST } from "./types";

export function addToast(payload) {
  const expires = { ...payload, expires: Date.now() + 3000 };
  return {
    payload: expires,
    type: ADD_TOAST
  };
}

export function removeToast() {
  return {
    payload: { currentDate: Date.now() },
    type: REMOVE_TOAST
  };
}
