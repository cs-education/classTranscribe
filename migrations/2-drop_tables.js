'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * dropTable "EchoSections"
 * dropTable "YoutubeChannels"
 *
 **/

var info = {
    "revision": 2,
    "name": "drop_tables",
    "created": "2019-03-05T23:55:34.031Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "dropTable",
        params: ["EchoSections"]
    },
    {
        fn: "dropTable",
        params: ["YoutubeChannels"]
    }
];

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
