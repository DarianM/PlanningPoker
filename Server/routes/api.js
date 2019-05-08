const express = require("express");
const router = express.Router();
const ws = require("ws").Server;
const wss = new ws({ host: "192.168.1.105", port: "2345" });
const joi = require("joi");
const db = require("../db/db_utils");

const roomsSockets = {};
let disconnectedIPs = [];

wss.on("connection", (s, req) => {
  const roomId = req.url.substring(1);
  roomsSockets[roomId]
    ? roomsSockets[roomId].push(s)
    : (roomsSockets[roomId] = [s]);
  const currentIp = req.connection.remoteAddress;
  console.log(currentIp + " connected");
  s.isAlive = true;
  const interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (!ws.isAlive) {
        console.log("terminating");
        ws.terminate();
      }
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
    const data = JSON.parse(m);
    console.log(data);

    if (data.action === "USER_VOTED") {
      const { user, roomId, voted, id } = data;
      roomsSockets[roomId].forEach(s => {
        if (s.readyState === 1)
          s.send(
            JSON.stringify({ action: "USER_VOTED", user, roomId, voted, id })
          );
      });
    }
  });

  s.on("close", (code, reason) => {
    roomsSockets[roomId] = roomsSockets[roomId].filter(socket => socket !== s);
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
    roomsSockets[roomId] = roomsSockets[roomId] || [];
    roomsSockets[roomId].forEach(s => {
      if (s.readyState === 1)
        s.send(
          JSON.stringify({ reason: "USER_JOINED", data: { user, userId } })
        );
    });
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

  await res.send(await db.createRoom(owner, roomName));
});

module.exports = router;
