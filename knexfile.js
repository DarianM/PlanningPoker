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
  // production: {
  //   client: "postgresql",
  //   connection: process.env.DATABASE_URL,
  //   ssl: true,
  //   migrations: {
  //     directory: "./db/migrations"
  //   }
  // },
  production: {
    client: "postgresql",
    connection: {
      host: "192.168.96.104",
      user: "admin",
      password: "1qa2ws3ed",
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
