'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var env = process.env.NODE_ENV || 'development';
// var config = require(__dirname + '/../config/config.js')[env];
var db = {};
var sqlHost = process.env.MSSQL_PORT_1433_TCP_ADDR;
var sqlPass = process.env.SQL_PASS;
var sqlDb = process.env.SQL_DB;
var sqlUser = process.env.SQL_USER;
var sequelize;

// /* sequelize = new Sequelize('database', 'username', 'password')*/
// sequelize = new Sequelize('TestDb', 'TestAdmin', 'Test123!', {
//     host: 'ct18.database.windows.net',
//     dialect: 'mssql',
//     port: 1433,
//
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },
//     dialectOptions: {
//         encrypt: true
//     }
// });

/* sequelize = new Sequelize('database', 'username', 'password')*/
sequelize = new Sequelize(sqlDb, sqlUser, sqlPass, {
  /* uses docker container's name/ID for host */
    host: sqlHost,
    dialect: 'mssql',
    port: 1433,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    dialectOptions: {
        encrypt: true
    }
});

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join (__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
