const express = require("express");
const ws = require("ws").Server;
const wss = new ws({ port: 2345 });
const roomsSockets = { 1: [] };

wss.on("connection", (s, req) => {
  // const roomId = req.url;
  // s.roomId = roomId;
  roomsSockets;
  s.on("message", m => {
    s.roomId = JSON.parse(m).id;
  });
  console.log("connected");
});

const router = express.Router();
const joi = require("joi");
const knex = require("../db/config");

const getRoomMembers = async roomId => {
  return await knex("members")
    .select(["name as member", "id"])
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
};

const checkUserUniquenessWithinRoom = async (user, roomId) => {
  const roomMembers = await getRoomMembers(roomId);
  return roomMembers.find(m => {
    const userToCompare = `^${m.member}$`;
    return new RegExp(userToCompare, "i").test(user);
  });
};

const addUserToRoom = async (user, roomId) => {
  let userId;
  await knex.transaction(async trx => {
    [userId] = await knex("members")
      .transacting(trx)
      .insert({ name: user });
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId, roomId });
  });
  const roomMembers = await getRoomMembers(roomId);

  const { roomName } = await knex("rooms")
    .select("name as roomName")
    .where({ id: roomId })
    .first();

  console.log(`Clients size: ${wss.clients.size}`);
  wss.clients.forEach(c => {
    console.log(`client room ${c.roomId} param room id ${roomId}`);

    if (c.roomId === roomId) {
      console.log("sending...");
      c.send(JSON.stringify({ user, userId }));
    }
  });
  return { user, roomId, roomMembers, roomName };
};

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

const validateNewMember = async (req, res, next) => {
  const schema = joi.object().keys({
    roomId: joi.number().integer(),
    user: joi.string().not("")
  });
  try {
    await joi.validate(req.body, schema);
    next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

router.get("/", async (req, res) => {
  res.send({ message: "Hello. You are @ localhost:3000/api" });
});

const checkRoomAvailability = async id => {
  const [roomId] = await knex("rooms")
    .select()
    .where({ id });
  return roomId;
};

router.post("/member", validateNewMember, async (req, res) => {
  const { roomId, user } = req.body;

  const isRoomAvailable = await checkRoomAvailability(roomId);
  if (isRoomAvailable === undefined) {
    return res.status(400).send({ error: "Room not available" });
  }

  const isUsernameTaken = await checkUserUniquenessWithinRoom(user, roomId);
  !isUsernameTaken
    ? res.send(await addUserToRoom(user, roomId))
    : res.status(400).send({
        error: "A user with the same name already exists in the room"
      });
});

router.post("/room", validateNewRoom, async (req, res) => {
  const roomName = req.body.roomName || "NewRoom";
  const owner = req.body.user;

  res.send(await createRoom(owner, roomName));
});

async function createRoom(owner, roomName) {
  let memberId, roomId;
  await knex.transaction(async trx => {
    [memberId] = await knex("members")
      .transacting(trx)
      .insert({ name: owner });
    [roomId] = await knex("rooms")
      .transacting(trx)
      .insert({ name: roomName });
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId: memberId, roomId });
  });
  return { roomId, memberId, roomName };
}

module.exports = router;
