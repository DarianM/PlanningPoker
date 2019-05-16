function post(url, payload, receivedFetch) {
  const fetch = receivedFetch || window.fetch;
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        resolve(data);
      } else {
        handleError(response, reject);
      }
    } catch (error) {
      reject(new Error("Check your internet connection"));
    }
  });
}

const handleError = (response, reject) => {
  if (response.status === 504) reject(new Error("Server offline"));
  if (response.status === 400) {
    response
      .json()
      .then(data => reject(data.error))
      .catch(() => reject(new Error("Bad request")));
  }
};

const vote = (user, roomId, voted) =>
  post("/api/vote", { user, roomId, voted });

const join = (user, roomId) => post("/api/member", { user, roomId });

const create = (user, roomName) => post("/api/room", { user, roomName });

export { vote, join, create };
