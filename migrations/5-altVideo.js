'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "altVideoHashsum" to table "MSTranscriptionTasks"
 * addColumn "altVideoLocalLocation" to table "MSTranscriptionTasks"
 *
 **/

var info = {
    "revision": 5,
    "name": "altVideo",
    "created": "2019-04-24T19:45:28.260Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "MSTranscriptionTasks",
            "altVideoHashsum",
            {
                "type": Sequelize.TEXT,
                "field": "altVideoHashsum"
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "MSTranscriptionTasks",
            "altVideoLocalLocation",
            {
                "type": Sequelize.TEXT,
                "field": "altVideoLocalLocation"
            }
        ]
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
