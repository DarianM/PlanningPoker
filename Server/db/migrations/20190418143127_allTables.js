exports.up = async knex => {
  await knex.schema.createTable("members", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("vote");
  });
  await knex.schema.createTable("rooms", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.dateTime("started");
  });
  await knex.schema.createTable("roomsMembers", table => {
    table.integer("userId").notNullable();
    table.integer("roomId").notNullable();
    table.primary(["userId", "roomId"]);
    table
      .foreign("userId")
      .references("id")
      .inTable("members");
    table
      .foreign("roomId")
      .references("id")
      .inTable("rooms");
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists("members");
  await knex.schema.dropTableIfExists("rooms");
  await knex.schema.dropTableIfExists("roomsMembers");
};
