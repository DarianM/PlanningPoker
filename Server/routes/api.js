const express = require("express");

const router = express.Router();
const ws = require("ws").Server;

const wss = new ws({ port: "2345" });
const joi = require("joi");
const db = require("../db/db_utils");
const wsServer = require("../ws/wsServer");

const server = new wsServer(wss);
server.listen();

const validateNewRoom = async (req, res, next) => {
  const schema = joi.object().keys({
    user: joi.string().not(""),
    roomName: joi.string().allow("")
  });
  try {
    await joi.validate(req.body, schema);
    next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

const validateMember = async (req, res, next) => {
  let schema = joi.object().keys({
    roomId: joi.number().integer(),
    user: joi.string().not("")
  });
  if (req.body.voted) {
    const allowedVotes = [
      "0",
      "1/2",
      "1",
      "2",
      "3",
      "5",
      "8",
      "13",
      "20",
      "40",
      "100"
    ];
    schema = schema.keys({ voted: joi.string().valid(allowedVotes) });
  }
  try {
    await joi.validate(req.body, schema);
    next();
  } catch (error) {
    return res.status(400).send({ error: "wrong type" });
  }
};

const validateRoomId = async (req, res, next) => {
  const schema = joi.number().integer();
  const { roomId } = req.params || req.body;
  try {
    await joi.validate(roomId, schema);
    next();
  } catch (error) {
    return res.status(400).send({ error: "wrong type" });
  }
};

const validateDate = async (req, res, next) => {
  const { date } = req.body;
  const dateInstance = new Date(date);
  if (dateInstance instanceof Date && !isNaN(dateInstance)) next();
  else {
    return res.status(400).send({ error: "wrong type" });
  }
};

router.delete("/votes/:roomId", validateRoomId, async (req, res) => {
  const { roomId } = req.params;
  await db.deleteRoomVotes(roomId);
  server.broadcast(roomId, {
    reason: "CLEAR_VOTES",
    data: { flip: false, list: [], end: undefined }
  });
  res.send({}).status(200);
});

router.get("/:roomId", validateRoomId, async (req, res) => {
  const roomId = req.params.roomId;
  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res.status(400).send({ error: "Room not available" });
  }
  const roomMembers = await db.getRoomMembers(roomId);
  const { roomName } = await db.getRoomName(roomId);
  const { started } = await db.getGameStart(roomId);
  res.send({ roomMembers, roomName, started });
});

router.post("/vote", validateMember, async (req, res) => {
  const { user, roomId, voted } = req.body;
  const id = await db.addMemberVote(user, roomId, voted);
  const data = {
    reason: "USER_VOTED",
    data: { user, voted, id }
  };
  server.broadcast(roomId, data);

  const nullVotes = await db.checkUserVotes(roomId);
  if (nullVotes.length === 0) {
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { flip: true } });
  }
  res.send({}).status(200);
});

router.post("/start", validateDate, validateRoomId, async (req, res) => {
  const { date, roomId } = req.body;
  await db.startGame(date, roomId);

  const data = {
    reason: "GAME_STARTED",
    data: { date }
  };

  server.broadcast(roomId, data);
  res.send({}).status(200);
});

router.post("/member", validateMember, async (req, res) => {
  const { roomId, user } = req.body;

  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res.status(400).send({ error: "Room not available" });
  }
  const roomMembers = await db.getRoomMembers(roomId);
  const isUsernameTaken = await db.checkUserUniquenessWithinRoom(
    user,
    roomMembers
  );

  if (!isUsernameTaken) {
    const roomInfo = await db.addUserToRoom(user, roomId, roomMembers);
    const { started } = await db.getGameStart(roomId);
    roomInfo.started = started;
    const { userId } = roomInfo;
    let data = {
      reason: "USER_JOINED",
      data: { user, userId }
    };
    server.broadcast(roomId, data);
    data = {
      reason: "FLIP_CARDS",
      data: { flip: false }
    };
    server.broadcast(roomId, data);
    await res.send({ roomInfo });
  } else {
    res.status(400).send({
      error: "A user with the same name already exists in the room"
    });
  }
});

router.post("/room", validateNewRoom, async (req, res) => {
  const roomName = req.body.roomName || "NewRoom";
  const owner = req.body.user;

  res.send(await db.createRoom(owner, roomName));
});

module.exports = router;
