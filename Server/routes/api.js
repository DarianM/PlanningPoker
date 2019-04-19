const express = require("express");

const router = express.Router();
const joi = require("joi");
const knex = require("../db/config");

router.get("/", async (req, res) => {
  res.send({ message: "Hello. You are @ localhost:3000/api" });
});

const validateMember = async (req, res, next) => {
  const memberSchema = joi.object().keys({
    user: joi.string().not(""),
    roomName: joi.string().allow("")
  });
  try {
    await joi.validate(req.body, memberSchema);
    next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

router.post("/join", async (req, res) => {
  const roomId = req.body.id;
  const name = req.body.user;
  const result = await knex("members")
    .select("name")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId, name });
  console.log(result);
});

router.post("/room", validateMember, async (req, res) => {
  const roomName = req.body.roomName || "NewRoom";
  const owner = req.body.user;

  res.send(await createRoom(owner, roomName));
});

async function createRoom(owner, roomName) {
  let memberId;
  let roomId;
  await knex.transaction(async trx => {
    [memberId] = await knex("members")
      .transacting(trx)
      .insert({ name: owner })
      .returning("id");
    [roomId] = await knex("rooms")
      .transacting(trx)
      .insert({ name: roomName })
      .returning("id");
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId: memberId, roomId });
  });
  return { roomId, memberId };
}

module.exports = router;
