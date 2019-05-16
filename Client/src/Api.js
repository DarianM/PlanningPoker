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
        const { id } = await response.json();
        resolve(id);
      } else {
        reject(new Error("Server offline"));
      }
    } catch (error) {
      reject(new Error("Check your internet connection"));
    }
  });
}

const vote = (user, roomId, voted) =>
  post("/api/vote", { user, roomId, voted });

const join = (user, roomId) => post("/api/join", { user, roomId });

export { vote, join };
