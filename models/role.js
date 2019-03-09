const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Role = sequelize.define('Role', {
        id: { type: DataTypes.UUID, primaryKey: true },
        roleName: DataTypes.TEXT,
    });

    return Role;
};
