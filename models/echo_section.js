'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var EchoSection = sequelize.define('EchoSection', {
        sectionId: { type: DataTypes.TEXT, primaryKey: true },
        courseId: DataTypes.TEXT,
        json: DataTypes.JSON
    });
    return EchoSection;
};