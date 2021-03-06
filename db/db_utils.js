const knex = require("./config.js");

async function disconnectUser(userId, roomId, server) {
  const { name } = await getUserById(userId);
  await deleteUser(userId);
  server.broadcast(roomId, { reason: "USER_LEFT", data: { name } });
  const nullVotes = await checkUserVotes(roomId);
  if (nullVotes.length === 0) {
    const votes = await flipVotes(roomId);
    server.broadcast(roomId, { reason: "FLIP_CARDS", data: { votes } });
  }
}

const getRoomMembers = async roomId => {
  return await knex("members")
    .select(["name as member", "vote as voted", "id"])
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
};

const getRoomStories = async roomId => {
  return await knex("stories")
    .select()
    .where({ roomId });
};

const getNextStory = async roomId => {
  return await knex("stories")
    .select()
    .where({ roomId, ended: null, isActive: 0 })
    .first();
};

const getUserById = async id => {
  return await knex("members")
    .select("name")
    .where({ id })
    .first();
};

const addStory = async (roomId, story, isActive) => {
  return await knex("stories")
    .insert({ roomId, description: story, isActive })
    .returning("id");
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

const getRoomStats = async id => {
  return await knex("rooms")
    .select("name as roomName", "flipped")
    .where({ id })
    .first();
};

const update = async (table, column, value, whereClause) => {
  await knex(table)
    .update(column, value)
    .where(whereClause);
};

async function createRoom(owner, roomName) {
  let memberId, roomId;
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
  return { roomId, memberId, roomName };
}

const addUserToRoom = async (user, roomId, roomMembers) => {
  let userId;
  await knex.transaction(async trx => {
    [userId] = await knex("members")
      .transacting(trx)
      .insert({ name: user })
      .returning("id");
    await knex("roomsMembers")
      .transacting(trx)
      .insert({ userId, roomId });
  });

  roomMembers.push({ member: user, id: userId });
  const { roomName } = await getRoomStats(roomId);

  return { user, userId, roomId, roomMembers, roomName };
};

const deleteUser = async userId => {
  await knex.transaction(async trx => {
    await knex("members")
      .transacting(trx)
      .where({ id: userId })
      .del();
    await knex("roomsMembers")
      .transacting(trx)
      .where({ userId })
      .del();
  });
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

const deleteRoomVotes = async (roomId, storyId) => {
  const ids = await knex("members")
    .select("id")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
  await knex("stories")
    .update({ ended: null })
    .where({ id: storyId });
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

const flipVotes = async (roomId, storyId) => {
  return await knex("members")
    .select("id", "name", "vote")
    .innerJoin("roomsMembers", "members.id", "roomsMembers.userId")
    .where({ roomId });
};

const checkStory = async id => {
  return (
    (await knex("stories")
      .select()
      .where({ id })
      .first()) && true
  );
};

const startStory = async (started, id) => {
  await knex("stories")
    .update({ started, isActive: true })
    .where({ id });
};

const endStory = async (ended, id) => {
  await knex("stories")
    .update({ ended })
    .where({ id });
};

const editStory = async (description, id) => {
  await knex("stories")
    .update({ description })
    .where({ id });
};

const resetTimer = async (storyId, newStart) => {
  await knex("stories")
    .update({ started: newStart })
    .where({ id: storyId });
};

module.exports = {
  getRoomMembers,
  getRoomStories,
  getNextStory,
  getUserById,
  getRoomStats,
  checkUserUniquenessWithinRoom,
  checkRoomAvailability,
  checkUserVotes,
  createRoom,
  addUserToRoom,
  addMemberVote,
  checkStory,
  startStory,
  endStory,
  deleteRoomVotes,
  deleteUser,
  flipVotes,
  update,
  addStory,
  editStory,
  resetTimer,
  disconnectUser
};
