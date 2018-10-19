const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Course = sequelize.define('Course', {
        id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: uuid() },
        courseNumber: DataTypes.TEXT,
        courseName: DataTypes.TEXT,
        courseDescription: DataTypes.TEXT,
    });

    Course.associate = function(models) {
      models.Course.belongsTo(models.Dept, { foreignKey: 'deptId' });
    };

    return Course;
};
