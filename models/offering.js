const uuid = require('uuid/v4');
'use strict';
// var models = require('../models');
module.exports = (sequelize, DataTypes) => {
    var Offering = sequelize.define('Offering', {
        id: { type: DataTypes.UUIDV4, primaryKey: true, defaultValue: uuid() },
        section: DataTypes.TEXT,
    });

    Offering.associate = function(models) {
      models.Offering.belongsTo(models.Term, { foreignKey: 'termId' });
      models.Offering.belongsTo(models.Dept, { foreignKey: 'deptId' });
      models.Offering.belongsTo(models.University, { foreignKey: 'universityId' });
    };

    return Offering;
};
