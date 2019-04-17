exports.up = async knex => {
  await knex.schema.createTable("rooms", table => {
    table.increments("id").primary();
    table
      .integer("uid")
      .unique()
      .notNullable();
  });
};

exports.down = async knex => {
  await knex.schema.dropTableIfExists("members");
};
