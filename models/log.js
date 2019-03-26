'use strict';

module.exports = (sequelize, DataTypes) => {
    var Log = sequelize.define('Log', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        courseOfferingId: { type: DataTypes.UUID },
        userId: { type: DataTypes.UUID },
        action: DataTypes.TEXT,
        item: DataTypes.TEXT,
        json: DataTypes.TEXT
    });

    return Log;
};
