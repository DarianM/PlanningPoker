exports.up = async knex => {
  await knex.schema.table("stories", table => {
    table.integer("order");
  });
};

exports.down = async knex => {
  await knex.schema.alterTable("stories", table => {
    table.dropColumn("order");
  });
};
