const knex = require("./config.js");

const getRoomMembers = async roomId => {
  return await knex("members")
    .select(["name as member", "vote as voted", "id"])
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
};

const getRoomVotes = async roomId => {
  const votes = await getRoomMembers(roomId);
};

const getGameStart = async id => {
  return await knex("rooms")
    .select("started")
    .where({ id })
    .first();
};

const checkUserUniquenessWithinRoom = async (user, roomMembers) => {
  return roomMembers.find(m => {
    const userToCompare = `^${m.member}$`;
    return new RegExp(userToCompare, "i").test(user);
  });
};

const checkRoomAvailability = async id => {
  const [roomId] = await knex("rooms")
    .select()
    .where({ id });
  return roomId;
};

const getRoomName = async roomId => {
  return await knex("rooms")
    .select("name as roomName")
    .where({ id: roomId })
    .first();
};

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

  return { user, userId, roomId, roomMembers, roomName };
};

const addMemberVote = async (user, roomId, vote) => {
  const [{ id }] = await knex("members")
    .select("id")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ name: user, roomId });
  await knex("members")
    .update({ vote })
    .where({ id });
  return id;
};

const deleteRoomVotes = async roomId => {
  const ids = await knex("members")
    .select("id")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
  ids.forEach(
    async id =>
      await knex("members")
        .update({ vote: null })
        .where(id)
  );
};

const checkUserVotes = async roomId => {
  return await knex("members")
    .select("vote")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId })
    .whereNull("vote");
};

const startGame = async (started, id) => {
  await knex("rooms")
    .update({ started })
    .where({ id });
};

module.exports = {
  getRoomMembers,
  getRoomVotes,
  checkUserUniquenessWithinRoom,
  checkRoomAvailability,
  checkUserVotes,
  getRoomName,
  createRoom,
  addUserToRoom,
  addMemberVote,
  startGame,
  getGameStart,
  deleteRoomVotes
};
