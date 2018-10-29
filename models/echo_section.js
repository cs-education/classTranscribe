const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var EchoSection = sequelize.define('EchoSection', {
        sectionId: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid() },
        courseId: DataTypes.TEXT,
        json: DataTypes.TEXT
    });
    return EchoSection;
};
