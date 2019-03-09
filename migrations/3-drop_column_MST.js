'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "mediaId" from table "MSTranscriptionTasks"
 *
 **/

var info = {
    "revision": 3,
    "name": "drop_column_MST",
    "created": "2019-03-05T23:57:53.242Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "removeColumn",
    params: ["MSTranscriptionTasks", "mediaId"]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
