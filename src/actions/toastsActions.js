import { ADD_TOAST, REMOVE_TOAST } from "./types";

let nextToastId = 0;
export function addToast(payload) {
  nextToastId += 1;
  return {
    payload,
    id: nextToastId,
    type: ADD_TOAST
  };
}

export function removeToast(id) {
  return {
    payload: id,
    type: REMOVE_TOAST
  };
}
