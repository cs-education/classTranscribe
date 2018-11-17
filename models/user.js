const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        id: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid() },
        mailId: DataTypes.TEXT,
        firstName: DataTypes.TEXT,
        lastName: DataTypes.TEXT,
        password: DataTypes.TEXT,
        passwordToken : DataTypes.TEXT,
        verified : DataTypes.BOOLEAN,
        verifiedId: DataTypes.TEXT,
    });

    User.associate = function(models) {
      models.User.belongsTo(models.University, { foreignKey: 'universityId' });
    };

    return User;
};
