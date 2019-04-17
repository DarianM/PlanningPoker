const express = require("express");

const router = express.Router();
const joi = require("joi");
const knex = require("../db/config");

router.get("/", async (req, res) => {
  res.send({ message: "Hello. You are @ localhost:3000/api" });
});

router.post("/", async (req, res) => {
  const memberSchema = joi.object().keys({
    user: joi.string()
  });

  const createRoom = async () => {
    let roomId = Math.ceil(Math.random() * 100);
    try {
      await knex("rooms").insert({ uid: roomId });
      return roomId;
    } catch (error) {
      error.errno === 19 ? await createRoom() : res.sendStatus(500);
    }
  };
  const roomId = await createRoom();

  try {
    await joi.validate(req.body, memberSchema);
    await knex("members").insert({ name: req.body.user });
    res.sendStatus(200);
  } catch (error) {
    error.errno === 19
      ? res.status(400).send("Name already taken")
      : res.sendStatus(400);
  }

  res.send({ roomId });
});

module.exports = router;
