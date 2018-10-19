const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var University = sequelize.define('University', {
        id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: uuid() },
        universityName: DataTypes.TEXT,
    });
    return University;
};
