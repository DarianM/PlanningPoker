import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE, WEBSOCKET_OPEN } from "./types";

const WEBSOCKET_PORT = 2345;
const host = () => window.location.host || "localhost";

export function connect(roomId) {
  return {
    type: WEBSOCKET_CONNECT,
    payload: `ws://${host()}:${WEBSOCKET_PORT}/${roomId}`
  };
}

export function close() {
  return { type: WEBSOCKET_CLOSE };
}

export function open() {
  return { type: WEBSOCKET_OPEN };
}
