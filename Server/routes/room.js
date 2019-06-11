const express = require("express");

const router = express.Router();

const server = require("../ws/wsServerConfig");

const validate = require("../validations");
const db = require("../db/db_utils");

router.get("/:roomId", validate.roomId, async (req, res) => {
  const { roomId } = req.params;
  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (!isRoomAvailable) {
    return res.status(400).send({ error: "Room not available" });
  }
  const roomMembers = await db.getRoomMembers(roomId);
  const roomStories = await db.getRoomStories(roomId);
  let { roomName } = await db.getRoomStats(roomId);
  const activeStory = roomStories.find(story => story.isActive);
  let votes,
    activeStoryId = null;
  if (activeStory) {
    activeStoryId = activeStory.id;
    const nullVotes = await db.checkUserVotes(roomId);
    if (nullVotes.length === 0) {
      votes = await db.flipVotes(roomId, activeStoryId);
      server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
    }
  }
  res.send({ roomMembers, roomStories, roomName, votes, activeStoryId });
});

router.post("/create", validate.newRoom, async (req, res) => {
  const roomName = req.body.roomName || "NewRoom";
  const owner = req.body.user;

  res.send(await db.createRoom(owner, roomName));
});

router.post("/join", validate.joinRoom, async (req, res) => {
  const { roomId, user } = req.body;

  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res
      .status(400)
      .send({ error: [{ message: "Room not available", location: "roomId" }] });
  }
  const roomMembers = await db.getRoomMembers(roomId);
  const isUsernameTaken = await db.checkUserUniquenessWithinRoom(
    user,
    roomMembers
  );

  if (!isUsernameTaken) {
    let roomInfo = await db.addUserToRoom(user, roomId, roomMembers);
    const roomStories = await db.getRoomStories(roomId);
    roomInfo = { ...roomInfo, roomStories };
    const { userId } = roomInfo;
    let data = {
      reason: "USER_JOINED",
      data: { user, userId }
    };
    server.broadcast(roomId, data);
    data = {
      reason: "FLIP_CARDS",
      data: { votes: [] }
    };
    server.broadcast(roomId, data);
    await res.send({ roomInfo });
  } else {
    res.status(400).send({
      error: [
        {
          message: "A user with the same name already exists in the room",
          location: "user"
        }
      ]
    });
  }
});

router.put("/rename/:roomId", validate.rename, async (req, res) => {
  const { roomName } = req.body;
  const { roomId } = req.params;
  await db.update("rooms", "name", roomName, { id: roomId });
  server.broadcast(roomId, { reason: "ROOM_NAME_UPDATED", data: { roomName } });
  res.send({}).status(200);
});

router.put("/forceflip/:roomId", validate.roomId, async (req, res) => {
  const { roomId } = req.params;
  const votes = await db.flipVotes(roomId);
  server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
  console.log(roomId);
  res.send({}).status(200);
});

module.exports = router;
