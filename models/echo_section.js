const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var EchoSection = sequelize.define('EchoSection', {
        sectionId: { type: DataTypes.UUID, primaryKey: true },
        courseId: DataTypes.TEXT,
        json: DataTypes.TEXT
    });
    return EchoSection;
};
