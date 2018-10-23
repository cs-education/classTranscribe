const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var CourseOffering = sequelize.define('CourseOffering', {
    });

    CourseOffering.associate = function(models) {
      models.CourseOffering.belongsTo(models.Course, { foreignKey: 'courseId' });
      models.CourseOffering.belongsTo(models.Offering, { foreignKey: 'offeringId' });
    };

    return CourseOffering;
};
