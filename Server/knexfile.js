// Update with your config settings.

module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db/dev.sqlite3"
    },
    migrations: {
      directory: "./db/migrations"
    }
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: "./db/test.sqlite3"
    },
    migrations: {
      directory: "./db/migrations"
    }
  }
};
