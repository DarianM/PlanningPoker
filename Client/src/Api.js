const POST = "POST";
const DELETE = "DELETE";
const PUT = "PUT";

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
        reject(data.error);
      }
    } catch (error) {
      reject(new Error("Check your internet connection"));
    }
  });
}

const vote = (user, roomId, voted) =>
  fetchMethod(POST, "/api/vote", { user, roomId, voted });

const join = (user, roomId) =>
  fetchMethod(POST, "/api/room/join", { user, roomId });

const create = (user, roomName) =>
  fetchMethod(POST, "/api/room/create", { user, roomName });

const start = (date, roomId, storyId) =>
  fetchMethod(POST, "/api/start", { date, roomId, storyId });

const clearVotes = roomId => fetchMethod(DELETE, `/api/votes/${roomId}`, {});

const flip = roomId => fetchMethod(PUT, `/api/forceflip/${roomId}`, {});

const updateRoomName = (roomId, roomName) =>
  fetchMethod(PUT, `/api/room/rename/${roomId}`, { roomName });

const addStory = (story, roomId) =>
  fetchMethod(POST, "/api/story", { story, roomId });

const editStory = (description, id, roomId) =>
  fetchMethod(PUT, "/api/story/rename", { description, id, roomId });

export {
  vote,
  join,
  create,
  start,
  clearVotes,
  flip,
  updateRoomName,
  addStory,
  editStory
};
