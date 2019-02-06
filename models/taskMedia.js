'use strict';
module.exports = (sequelize, DataTypes) => {
    var TaskMedia = sequelize.define('TaskMedia', {});

    TaskMedia.associate = function (models) {
        models.TaskMedia.belongsTo(models.MSTranscriptionTask, { foreignKey: 'taskId' });
        models.TaskMedia.belongsTo(models.Media, { foreignKey: 'mediaId' });
    };

    return TaskMedia;
};
