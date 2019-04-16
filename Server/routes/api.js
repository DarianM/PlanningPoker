const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile);
const joi = require("joi");

router.get("/", function(req, res, next) {
  res.send({ message: "Hello. You are @ localhost:3000/api" });
});

router.post("/", async (req, res, next) => {
  const schema = joi.object().keys({
    user: joi.string()
  });

  try {
    await joi.validate(req.body, schema);
    await knex("members").insert({ name: req.body.user });
    res.sendStatus(200);
  } catch (error) {
    res.sendStatus(400);
  }
});

module.exports = router;
