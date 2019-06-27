exports.up = async knex => {
  await knex.schema.createTable("members", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("vote");
  });
  await knex.schema.createTable("rooms", table => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.boolean("flipped");
  });
  await knex.schema.createTable("roomsMembers", table => {
    table.integer("userId").notNullable();
    table.integer("roomId").notNullable();
    table.primary(["userId", "roomId"]);
    table
      .foreign("userId")
      .references("id")
      .inTable("members")
      .onDelete("cascade");
    table
      .foreign("roomId")
      .references("id")
      .inTable("rooms")
      .onDelete("cascade");
  });
  await knex.schema.createTable("stories", table => {
    table.increments("id").primary();
    table.string("description").notNullable();
    table.integer("roomId").notNullable();
    table.boolean("completed").defaultTo(false);
    table.dateTime("started");
    table.dateTime("ended");
    table.boolean("isActive").defaultTo(false);
    table
      .foreign("roomId")
      .references("id")
      .inTable("rooms")
      .onDelete("cascade");
  });
};

exports.down = async knex => {
  await knex.raw("DROP TABLE if exists members CASCADE");
  await knex.raw("DROP TABLE if exists rooms CASCADE");
  await knex.raw("DROP TABLE if exists roomMembers CASCADE");
  await knex.raw("DROP TABLE if exists stories CASCADE");
};
