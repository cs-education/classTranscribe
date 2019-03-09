const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Dept = sequelize.define('Dept', {
        id: { type: DataTypes.UUID, primaryKey: true },
        deptName: DataTypes.TEXT,
        acronym: DataTypes.TEXT,
    });

    return Dept;
};
