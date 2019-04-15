const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile");
console.log(knexfile)
const knex = require("knex")(knexfile);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "asfjhasjk" });
});

router.get("/api", function (req, res, next) {
  res.send({ title: "asfjhasjk-test" });
});

router.post("/api", async (req, res, next) => {
  res.sendStatus(200);
  await knex("members").insert({ name: req.body.user });
});

module.exports = router;
