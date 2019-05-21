export default function post(url, payload, receivedFetch) {
  const fetch = receivedFetch || window.fetch;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: "POST",
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
  post("/api/vote", { user, roomId, voted });

const join = (user, roomId) => post("/api/member", { user, roomId });

const create = (user, roomName) => post("/api/room", { user, roomName });

const start = (date, roomId) => post("/api/start", { date, roomId });

export { vote, join, create, start };
