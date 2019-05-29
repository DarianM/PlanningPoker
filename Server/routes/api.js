const express = require("express");

const router = express.Router();
const ws = require("ws").Server;

const wss = new ws({ port: "2345" });
const db = require("../db/db_utils");
const wsServer = require("../ws/wsServer");
const validate = require("../validations");

const server = new wsServer(wss);
server.listen();

async function checkVotes(roomId) {
  const nullVotes = await db.checkUserVotes(roomId);
  if (nullVotes.length === 0) {
    await db.flipVotes(roomId, true);
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { flip: true } });
  }
}

router.post("/story", validate.newStory, async (req, res) => {
  const { story, roomId } = req.body;
  const [id] = await db.addStory(roomId, story);
  server.broadcast(roomId, {
    reason: "NEW_STORY",
    data: { story, id, completed: false }
  });
  res.send({}).status(200);
});

router.put("/story/rename", async (req, res) => {
  const { description, id, roomId } = req.body;
  await db.editStory(description, id);
  server.broadcast(roomId, {
    reason: "STORY_RENAMED",
    data: { description, id }
  });
  res.send({}).status(200);
});

router.delete("/user/:userId", validate.delete, async (req, res) => {
  const { userId } = req.params;
  const { roomId } = req.body;
  const { name } = await db.getUserById(userId);
  await db.deleteUser(userId);
  server.broadcast(roomId, { reason: "USER_LEFT", data: { name } });
  await checkVotes(roomId);
  res.send({}).status(200);
});

router.delete("/votes/:roomId", validate.roomId, async (req, res) => {
  const { roomId } = req.params;
  await db.deleteRoomVotes(roomId);
  await db.flipVotes(roomId, false);
  server.broadcast(roomId, {
    reason: "CLEAR_VOTES",
    data: { flip: false, list: [], end: undefined }
  });
  res.send({}).status(200);
});

router.get("/:roomId", validate.roomId, async (req, res) => {
  const { roomId } = req.params;
  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res.status(400).send({ error: "Room not available" });
  }
  const roomMembers = await db.getRoomMembers(roomId);
  let { roomName, started, flipped } = await db.getRoomStats(roomId);
  flipped = flipped === 1;
  res.send({ roomMembers, roomName, started, flipped });
});

router.put("/forceflip/:roomId", validate.roomId, async (req, res) => {
  const { roomId } = req.params;
  await db.flipVotes(roomId, true);
  server.broadcast(roomId, { reason: "FLIP_CARDS", data: { flip: true } });
  res.send({}).status(200);
});

router.post("/vote", validate.vote, async (req, res) => {
  const { user, roomId, voted } = req.body;
  const id = await db.addMemberVote(user, roomId, voted);
  const data = {
    reason: "USER_VOTED",
    data: { user, voted, id }
  };
  server.broadcast(roomId, data);
  await checkVotes(roomId);
  res.send({}).status(200);
});

router.post("/start", validate.date, validate.gameStart, async (req, res) => {
  const { date, roomId, storyId } = req.body;
  await db.startStory(date, storyId);

  const data = {
    reason: "STORY_STARTED",
    data: { date, storyId }
  };

  server.broadcast(roomId, data);
  res.send({}).status(200);
});

module.exports = { router, server };
