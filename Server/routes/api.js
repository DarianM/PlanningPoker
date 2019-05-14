const express = require("express");

const router = express.Router();
const ws = require("ws").Server;
const wss = new ws({ host: "192.168.1.105", port: "2345" });
const joi = require("joi");
const db = require("../db/db_utils");
const wsServer = require("../wsServer");

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
    schema = schema.keys({ voted: joi.string().allow(allowedVotes) });
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
  try {
    await joi.validate(req.params.roomId, schema);
    next();
  } catch (error) {
    return res.status(400).send({ error: "wrong type" });
  }
};

router.get("/:roomId", validateRoomId, async (req, res) => {
  const roomId = req.params.roomId;
  const isRoomAvailable = await db.checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res.status(400).send({ error: "Room not available" });
  }
  const members = await db.getRoomMembers(roomId);
  const { roomName } = await db.getRoomName(roomId);
  res.send({ members, roomName });
});

router.post("/vote", validateMember, async (req, res) => {
  const { user, roomId, voted } = req.body;
  const id = await db.addMemberVote(user, roomId, voted);
  res.send({ id });
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
    const credentials = await db.addUserToRoom(user, roomId, roomMembers);
    const { userId } = credentials;
    const data = JSON.stringify({
      reason: "USER_JOINED",
      data: { user, userId }
    });
    server.broadcast(roomId, data);
    await res.send(credentials);
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
