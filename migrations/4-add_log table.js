'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Logs", deps: []
 *
 **/

var info = {
    "revision": 4,
    "name": "add log table",
    "created": "2019-03-23T18:11:50.688Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Logs",
        {
            "id": {
                "type": Sequelize.INTEGER,
                "field": "id",
                "primaryKey": true,
                "autoIncrement": true
            },
            "courseOfferingId": {
                "type": Sequelize.UUID,
                "field": "courseOfferingId"
            },
            "userId": {
                "type": Sequelize.UUID,
                "field": "userId"
            },
            "action": {
                "type": Sequelize.TEXT,
                "field": "action"
            },
            "item": {
                "type": Sequelize.TEXT,
                "field": "item"
            },
            "json": {
                "type": Sequelize.TEXT,
                "field": "json"
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        },
        {}
    ]
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
