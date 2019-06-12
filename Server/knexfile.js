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
  production: {
    client: "postgresql",
    connection: {
      host: "192.168.96.104",
      user: "admin",
      password: process.env.DB_PASS,
      database: "test"
    },
    migrations: {
      directory: "./db/migrations"
    }
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
