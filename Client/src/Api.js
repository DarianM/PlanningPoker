const POST = "POST";
const DELETE = "DELETE";

export default function fetchMethod(method, url, payload, receivedFetch) {
  const fetch = receivedFetch || window.fetch;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        resolve(data);
      } else {
        reject(new Error(data.error));
      }
    } catch (error) {
      reject(new Error("Check your internet connection"));
    }
  });
}

const vote = (user, roomId, voted) =>
  fetchMethod(POST, "/api/vote", { user, roomId, voted });

const join = (user, roomId) =>
  fetchMethod(POST, "/api/member", { user, roomId });

const create = (user, roomName) =>
  fetchMethod(POST, "/api/room", { user, roomName });

const start = (date, roomId) =>
  fetchMethod(POST, "/api/start", { date, roomId });

const clearVotes = roomId => fetchMethod(DELETE, `/api/votes/${roomId}`, {});

export { vote, join, create, start, clearVotes };
