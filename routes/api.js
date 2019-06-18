const express = require("express");

const router = express.Router();

const db = require("../db/db_utils");

const validate = require("../validations");
let serverConfig = require("../ws/wsServerConfig");

async function checkVotes(roomId, storyId) {
  const { server } = serverConfig;
  const nullVotes = await db.checkUserVotes(roomId);
  const { server } = serverConfig;
  if (nullVotes.length === 0) {
    const votes = await db.flipVotes(roomId, storyId);
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
  }
}

async function disconnectUser(userId, roomId, server) {
  const { name } = await db.getUserById(userId);
  await db.deleteUser(userId);
  server.broadcast(roomId, { reason: "USER_LEFT", data: { name } });
  const nullVotes = await db.checkUserVotes(roomId);
  if (nullVotes.length === 0) {
    const votes = await db.flipVotes(roomId);
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
  }
}

router.delete("/user/:userId", validate.delete, async (req, res) => {
  const { userId } = req.params;
  const { roomId } = req.body;
  const { server } = serverConfig;
  await disconnectUser(userId, roomId, server);
  res.send({}).status(200);
});

router.delete(
  "/votes/:roomId",
  validate.roomId,
  validate.storyId,
  async (req, res) => {
    const { roomId } = req.params;
    const { storyId } = req.body;
    await db.deleteRoomVotes(roomId, storyId);
    const { server } = serverConfig;

    server.broadcast(roomId, {
      reason: "CLEAR_VOTES"
    });
    res.send({}).status(200);
  }
);

router.post("/vote", validate.vote, async (req, res) => {
  const { user, storyId, roomId, value } = req.body;
  const id = await db.addMemberVote(user, roomId, value);
  const data = {
    reason: "USER_VOTED",
    data: { user, value, id }
  };
  const { server } = serverConfig;

  server.broadcast(roomId, data);
  await checkVotes(roomId, storyId);
  res.send({}).status(200);
});

module.exports = router;
