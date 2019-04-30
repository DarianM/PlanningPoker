const express = require("express");
const ws = require("ws").Server;
const wss = new ws({ host: "192.168.0.101", port: "2345" });
const roomsSockets = {};
let disconnectedIPs = [];

wss.on("connection", (s, req) => {
  const currentIp = req.connection.remoteAddress;
  console.log(currentIp + " connected");
  s.isAlive = true;
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        console.log("terminating");
        ws.terminate();
      }
      console.log(wss.clients.size);
      ws.isAlive = false;
      ws.ping("ping", false, err => console.log("--ping sent--"));
    });
  }, 7000);
  s.on("pong", () => {
    console.log("pong");
    s.isAlive = true;
  });
  s.on("message", m => {
    console.log("socket onmessage " + m);
    if (m === "ping") {
      return;
    }
    const roomId = JSON.parse(m).id;
    s.roomId = roomId;
    roomsSockets[roomId]
      ? roomsSockets[roomId].push(s)
      : (roomsSockets[roomId] = [s]);
  });
  s.on("close", (code, reason) => {
    roomsSockets[s.roomId] = roomsSockets[s.roomId].filter(
      socket => socket !== s
    );
    s.terminate();
    clearInterval(interval);
    console.log(roomsSockets);
    // code 1001 closed connection - 1006 lost connection

    console.log("client lost connection " + currentIp);
    disconnectedIPs.push(currentIp);
    setTimeout(() => {
      disconnectedIPs = disconnectedIPs.filter(ips => ips !== currentIp);
      console.log(disconnectedIPs);
    }, 20000);
  });
  s.on("error", err => console.log(err.message));
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

const checkUserUniquenessWithinRoom = async (user, roomMembers) => {
  return roomMembers.find(m => {
    const userToCompare = `^${m.member}$`;
    return new RegExp(userToCompare, "i").test(user);
  });
};

const addUserToRoom = async (user, roomId, roomMembers) => {
  let userId;
  await knex.transaction(async trx => {
    [userId] = await knex("members")
      .transacting(trx)
      .insert({ name: user });
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId, roomId });
  });

  roomMembers.push({ member: user, id: userId });

  const { roomName } = await getRoomName(roomId);

  roomsSockets[roomId] = roomsSockets[roomId] || [];
  roomsSockets[roomId].forEach(s => {
    if (s.readyState === 1) s.send(JSON.stringify({ user, userId }));
  });
  return { user, roomId, roomMembers, roomName };
};

const getRoomName = async roomId => {
  return await knex("rooms")
    .select("name as roomName")
    .where({ id: roomId })
    .first();
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

router.get("/recent", (req, res) => {
  const ip = req.connection.remoteAddress;
  if (disconnectedIPs.find(ips => ips === ip)) {
    res.send({ ip: `${ip}  -->  reconnection possible` });
  } else {
    res.send({ ip: "session expired" });
  }
});

router.get("/:roomId", async (req, res) => {
  const roomId = req.params.roomId;
  const members = await getRoomMembers(roomId);
  const { roomName } = await getRoomName(roomId);
  res.send({ members, roomName });
});

const checkRoomAvailability = async id => {
  const [roomId] = await knex("rooms")
    .select()
    .where({ id });
  return roomId;
};

router.post("/member", validateNewMember, async (req, res) => {
  setTimeout(async () => {
    const { roomId, user } = req.body;

    const isRoomAvailable = await checkRoomAvailability(roomId);
    if (isRoomAvailable === undefined) {
      return res.status(400).send({ error: "Room not available" });
    }
    const roomMembers = await getRoomMembers(roomId);

    const isUsernameTaken = await checkUserUniquenessWithinRoom(
      user,
      roomMembers
    );
    !isUsernameTaken
      ? res.send(await addUserToRoom(user, roomId, roomMembers))
      : res.status(400).send({
          error: "A user with the same name already exists in the room"
        });
  }, 4000);
});

router.post("/room", validateNewRoom, async (req, res) => {
  setTimeout(async () => {
    const roomName = req.body.roomName || "NewRoom";
    const owner = req.body.user;

    res.send(await createRoom(owner, roomName));
  }, 3000);
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
