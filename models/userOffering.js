const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var UserOffering = sequelize.define('UserOffering', {
        // id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: uuid() },
    });

    UserOffering.associate = function(models) {
      models.UserOffering.belongsTo(models.User, { foreignKey: 'userId' });
      models.UserOffering.belongsTo(models.CourseOffering, { foreignKey: 'courseOfferingId' });
      models.UserOffering.belongsTo(models.Role, { foreignKey: 'roleId' });
    };

    return UserOffering;
};
