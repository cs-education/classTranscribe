
module.exports = {
  development: {
    database: process.env.SQL_DB,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    host: "host.docker.internal",
    port: 1433,
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        encrypt: true
    }
  },
  production: {
    database: process.env.SQL_DB,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    host: process.env.MSSQL_PORT_1433_TCP_ADDR,
    port: 1433,
    dialect: 'mssql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        encrypt: true
    }
  },
}