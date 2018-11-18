const uuid = require('uuid/v4');
'use strict';
module.exports = (sequelize, DataTypes) => {
    var YoutubeChannel = sequelize.define('YoutubeChannel', {
        playlistId: { type: DataTypes.UUID, primaryKey: true, defaultValue: uuid()},
        channelId: DataTypes.TEXT
    });
    return YoutubeChannel;
};
