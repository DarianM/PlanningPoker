const express = require("express");

const router = express.Router();
const joi = require("joi");
const knex = require("../db/config");

router.get("/", async (req, res) => {
  res.send({ message: "Hello. You are @ localhost:3000/api" });
});

const validateMember = async (req, res, next) => {
  const memberSchema = joi.object().keys({
    user: joi.string()
  });
  try {
    await joi.validate(req.body, memberSchema);
    next();
  } catch (error) {
    return res.sendStatus(400);
  }
};

const createRoom = async (req, res, next) => {
  const UNIQUE_CONSTRAINT_FAILED = 19;
  let roomId = Math.ceil(Math.random() * 100);
  try {
    await knex("rooms").insert({ uid: roomId });
    req.body.roomId = roomId;
    next();
  } catch (error) {
    error.errno === UNIQUE_CONSTRAINT_FAILED
      ? await createRoom()
      : res.sendStatus(500);
  }
};

router.post("/room", validateMember, createRoom, async (req, res) => {
  try {
    const [memberId] = await knex("members")
      .insert({ name: req.body.user })
      .returning("id");
    res.send({ roomId: req.body.roomId, memberId });
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
