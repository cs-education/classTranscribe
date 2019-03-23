'use strict';
const uuid = require('uuid/v4');

module.exports = (sequelize, DataTypes) => {
    var CourseOffering = sequelize.define('CourseOffering', {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid() },
      // 0 - Public - Video playback is available to everyone
      // 1 - Private - Only enrolled and manually added users
      // 2 - Signed In - Usage is tracked by user id
      // 3 - University Only - Authenticated and at the same institution
      role: { type : DataTypes.TINYINT },
    });

    CourseOffering.associate = function(models) {
      models.CourseOffering.belongsTo(models.Course, { foreignKey: 'courseId' });
      models.CourseOffering.belongsTo(models.Offering, { foreignKey: 'offeringId' });
    };

    return CourseOffering;
};
