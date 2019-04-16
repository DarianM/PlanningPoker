const express = require("express");
const router = express.Router();
const knexfile = require("../knexfile");
const knex = require("knex")(knexfile);

/* GET home page. */
router.get("/", function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
