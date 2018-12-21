'use strict';
// var models = require('../models')
module.exports = (sequelize, DataTypes) => {
  /* Since SQL append createTime and updateTime automatically, we don't need to track "when" */
    var Logging = sequelize.define('Logging', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        info: DataTypes.TEXT, /* JSON string that contains "who", "where", "what" */
        logType: DataTypes.TEXT /* Logging, Warning, Error, Fatal */
    });

    return Logging;
};
