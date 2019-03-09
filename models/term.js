const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Term = sequelize.define('Term', {
        id: { type: DataTypes.UUID, primaryKey: true },
        termName: DataTypes.TEXT,
    });

    return Term;
};
