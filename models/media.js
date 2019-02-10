'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Media = sequelize.define('Media', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        videoURL: { type: DataTypes.TEXT },
        sourceType: DataTypes.TINYINT, // 0 for echo, 1 for youtube, 2 for local
        siteSpecificJSON: DataTypes.TEXT
    });
    return Media;
};
