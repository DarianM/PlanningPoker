// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/dev.sqlite3"
    },
    migrations: {
      directory: "./db/migrations"
    },
    useNullAsDefault: true
  },
  test: {
    client: "sqlite3",
    connection: ":memory:",
    migrations: {
      directory: "./db/migrations"
    },
    useNullAsDefault: true
  }
};
