
exports.up = async knex => {
    await knex.schema.createTable("members", table => {
        table.increments("id").primary();
        table.string("name").notNullable();
    });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists("members")
};
