const express = require("express");

const router = express.Router();

const validate = require("../validations");
const db = require("../db/db_utils");
const server = require("../ws/wsServerConfig");

router.post("/add", validate.newStory, async (req, res) => {
  const { story, roomId, active } = req.body;
  const [id] = await db.addStory(roomId, story, active);
  server.broadcast(roomId, {
    reason: "NEW_STORY",
    data: { story, id }
  });
  res.send({}).status(200);
});

router.put("/rename", async (req, res) => {
  const { description, id, roomId } = req.body;
  await db.editStory(description, id);
  server.broadcast(roomId, {
    reason: "STORY_RENAMED",
    data: { description, id }
  });
  res.send({}).status(200);
});

router.post("/start", validate.date, validate.gameStart, async (req, res) => {
  const { date, roomId, storyId } = req.body;
  await db.startStory(date, storyId);

  const data = {
    reason: "STORY_STARTED",
    data: { date }
  };

  server.broadcast(roomId, data);
  res.send({}).status(200);
});

router.post("/end", validate.date, validate.gameStart, async (req, res) => {
  const { date, roomId, storyId } = req.body;
  await db.endStory(date, storyId);

  const data = {
    reason: "STORY_ENDED",
    data: { date }
  };

  server.broadcast(roomId, data);
  res.send({}).status(200);
});

module.exports = router;
