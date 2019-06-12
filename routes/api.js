const express = require("express");

const router = express.Router();

const db = require("../db/db_utils");

const validate = require("../validations");
const server = require("../ws/wsServerConfig");

async function checkVotes(roomId, storyId) {
  const nullVotes = await db.checkUserVotes(roomId);
  if (nullVotes.length === 0) {
    const votes = await db.flipVotes(roomId, storyId);
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
  }
}

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
  server.broadcast(roomId, {
    reason: "CLEAR_VOTES"
  });
  res.send({}).status(200);
});

router.post("/vote", validate.vote, async (req, res) => {
  const { user, storyId, roomId, value } = req.body;
  const id = await db.addMemberVote(user, roomId, value);
  const data = {
    reason: "USER_VOTED",
    data: { user, value, id }
  };
  server.broadcast(roomId, data);
  await checkVotes(roomId, storyId);
  res.send({}).status(200);
});

module.exports = { router, server };
