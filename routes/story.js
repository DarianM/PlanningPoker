const express = require("express");

const router = express.Router();

const validate = require("../validations");
const db = require("../db/db_utils");
let serverConfig = require("../ws/wsServerConfig");

router.post("/add", validate.newStory, async (req, res) => {
  const { story, roomId, active } = req.body;
  const [id] = await db.addStory(roomId, story, active);
  const { server } = serverConfig;
  server.broadcast(roomId, {
    reason: "NEW_STORY",
    data: { story, id }
  });
  res.send({}).status(200);
});

router.put("/rename", validate.renameStory, async (req, res) => {
  const { story: description, storyId: id, roomId } = req.body;
  const story = await db.checkStory(id);
  const { server } = serverConfig;

  if (!story)
    return res.status(404).send({ error: [{ message: "Story not found" }] });
  else {
    await db.editStory(description, id);
    server.broadcast(roomId, {
      reason: "STORY_RENAMED",
      data: { description, id }
    });
    res.send({}).status(200);
  }
});

router.post("/start", validate.date, validate.gameStart, async (req, res) => {
  const { date, roomId, storyId } = req.body;
  await db.startStory(date, storyId);

  const data = {
    reason: "STORY_STARTED",
    data: { date }
  };
  const { server } = serverConfig;

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
  const { server } = serverConfig;

  server.broadcast(roomId, data);
  res.send({}).status(200);
});

router.put("/keep-alive", validate.storyId, async (req, res) => {
  const { storyId } = req.body;
  await db.resetStory(storyId);
  res.send({}).status(200);
});

router.put("/reset", async (req, res) => {
  // validations
  const { roomId, storyId } = req.body;
  const newDate = new Date(Date.now());
  const { server } = serverConfig;

  await db.resetTimer(storyId, newDate);
  server.broadcast(roomId, { reason: "TIMER_RESET", data: { newDate } });
  res.send({}).status(200);
});

router.put("/next", async (req, res) => {
  const { server } = serverConfig;
  const { endedStoryId, roomId } = req.body;
  await db.update("stories", "isActive", 0, { id: endedStoryId });
  const next = await db.getNextStory(roomId);
  if (next) {
    const date = new Date(Date.now());
    await db.update("stories", "isActive", 1, { id: next.id });
    await db.startStory(date, next.id);
    server.broadcast(roomId, {
      reason: "NEXT_STORY",
      data: { activeStoryId: next.id }
    });
    server.broadcast(roomId, { reason: "STORY_STARTED", data: { date } });
  } else {
    server.broadcast(roomId, {
      reason: "NEXT_STORY",
      data: { activeStoryId: null }
    });
  }
  res.send({}).status(200);
});

module.exports = router;
