export default function post(url, payload, receivedFetch) {
  const fetch = receivedFetch || window.fetch;
  return new Promise(async (resolve, reject) => {
    try {
      let data = null;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const text = await response.text();
      data = text.length ? JSON.parse(text) : {};
      if (response.ok) {
        resolve(data);
      } else {
        reject(data.error ? data.error : new Error("error on server"));
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

export { vote, join, create };
