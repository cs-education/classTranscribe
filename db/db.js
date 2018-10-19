'use strict';
var models = require('../models');
models.sequelize.sync();

function addCourseAndSection(courseId, sectionId, downloadHeader) {
    return models.EchoSection.findOrCreate({
        where: {
            sectionId: sectionId
        },
        defaults: {
            sectionId: sectionId,
            courseId: courseId,
            json: {
                downloadHeader: downloadHeader
            }
        }
    });
}

function addMedia(videoURL, sourceType, siteSpecificJSON) {
    return models.Media.create({
        videoURL: videoURL,
        sourceType: sourceType,
        siteSpecificJSON: siteSpecificJSON
    });
}

function addMSTranscriptionTask(mediaId) {
    return models.MSTranscriptionTask.create({
        mediaId: mediaId
    });
}

function getTask(taskId) {
    return models.MSTranscriptionTask.findById(taskId);
}

function getMedia(mediaId) {
    return models.Media.findById(mediaId);
}

function getEchoSection(sectionId) {
    return models.EchoSection.findById(sectionId);
}

function createUser(user) {
  return models.User.create(user);
}

module.exports = {
    models: models,
    addCourseAndSection: addCourseAndSection,
    addMedia: addMedia,
    addMSTranscriptionTask: addMSTranscriptionTask,
    getTask: getTask,
    getMedia: getMedia,
    getEchoSection: getEchoSection,
    createUser: createUser
}
