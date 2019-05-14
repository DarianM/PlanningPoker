import { WEBSOCKET_CONNECT, WEBSOCKET_CLOSE } from "./types";

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
