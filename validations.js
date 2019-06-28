const joi = require("@hapi/joi");

const handleError = (errors, res) => {
  return res.status(400).send({
    error: errors.map(e => {
      return { message: e.message, location: e.context.key };
    })
  });
};

const validate = (value, schema, res, next) => {
  const { error } = joi.validate(value, schema, {
    abortEarly: false
  });
  if (error) {
    const { details } = error;
    return handleError(details, res);
  }
  next();
};
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

const user = joi
  .string()
  .regex(/^\s*(\S\s*){3,20}$/)
  .error(() => "Please insert a valid username");
const userId = joi.number().integer();
const roomName = joi
  .string()
  .regex(/^\s*(\S\s*){5,30}$/)
  .allow("")
  .error(() => "Room name must have between 5-30 characters");
const roomId = joi
  .number()
  .integer()
  .error(() => "Please provide a valid room id");
const value = joi
  .string()
  .valid(allowedVotes)
  .error(() => "Please provide a valid vote");
const storyId = joi.number().integer();
const active = joi.boolean();
const story = joi
  .string()
  .min(5)
  .max(40)
  .error(() => "Story description must have between 5-40 characters");
const date = joi.date();

module.exports = {
  newRoom: async (req, res, next) => {
    const schema = joi.object().keys({
      roomName,
      user
    });
    validate(req.body, schema, res, next);
  },

  joinRoom: async (req, res, next) => {
    const schema = joi.object().keys({
      roomId,
      user
    });
    validate(req.body, schema, res, next);
  },

  gameStart: async (req, res, next) => {
    const schema = joi.object().keys({
      date,
      roomId,
      storyId
    });
    validate(req.body, schema, res, next);
  },

  newStory: async (req, res, next) => {
    const schema = joi.object().keys({
      story,
      roomId,
      active
    });
    validate(req.body, schema, res, next);
  },

  renameStory: async (req, res, next) => {
    const schema = joi.object().keys({
      story,
      storyId,
      roomId
    });
    validate(req.body, schema, res, next);
  },

  rename: async (req, res, next) => {
    const merged = { ...req.body, ...req.params };
    const schema = joi.object().keys({
      roomName,
      roomId
    });
    validate(merged, schema, res, next);
  },

  delete: async (req, res, next) => {
    const merged = { ...req.body, ...req.params };
    const schema = joi.object().keys({
      userId,
      roomId
    });
    validate(merged, schema, res, next);
  },

  vote: async (req, res, next) => {
    const schema = joi.object().keys({
      user,
      storyId,
      roomId,
      value
    });
    validate(req.body, schema, res, next);
  },

  roomId: async (req, res, next) => {
    const schema = joi.object().keys({
      roomId
    });
    if (req.body.roomId) {
      validate(req.body, schema, res, next);
    } else validate(req.params, schema, res, next);
  },

  storyId: async (req, res, next) => {
    const schema = joi.object().keys({
      storyId
    });
    validate(req.body, schema, res, next);
  },

  date: async (req, res, next) => {
    const { date } = req.body;
    const dateInstance = new Date(date);
    if (dateInstance instanceof Date && !isNaN(dateInstance)) next();
    else {
      return res
        .status(400)
        .send({ error: [{ message: "wrong date", location: "date" }] });
    }
  }
};
