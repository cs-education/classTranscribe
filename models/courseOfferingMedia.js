const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var CourseOfferingMedia = sequelize.define('CourseOfferingMedia', {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid() },
      descpJSON: DataTypes.TEXT
    });

    CourseOfferingMedia.associate = function(models) {
      models.CourseOfferingMedia.belongsTo(models.CourseOffering, { foreignKey: 'courseOfferingId' });
      models.CourseOfferingMedia.belongsTo(models.Media, { foreignKey: 'mediaId' });
    };

    return CourseOfferingMedia;
};
