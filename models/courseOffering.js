const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var courseOffering = sequelize.define('courseOffering', {
    });

    courseOffering.associate = function(models) {
      models.courseOffering.belongsTo(models.Course, { foreignKey: 'courseId' });
      models.courseOffering.belongsTo(models.Offering, { foreignKey: 'offeringId' });
    };

    return courseOffering;
};
