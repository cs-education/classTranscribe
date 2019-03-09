const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var UpdationJobs = sequelize.define('UpdationJobs', {
        id: { type: DataTypes.UUID, primaryKey: true },
        startDate: DataTypes.DATEONLY,
        endDate: DataTypes.DATEONLY,
        sourceType: DataTypes.TINYINT,
        url: DataTypes.TEXT,
        params: DataTypes.TEXT
    });

    UpdationJobs.associate = function (models) {
        models.UpdationJobs.belongsTo(models.CourseOffering, { foreignKey: 'courseOfferingId' });
    };

    return UpdationJobs;
};
