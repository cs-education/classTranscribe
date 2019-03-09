'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Depts", deps: []
 * createTable "EchoSections", deps: []
 * createTable "Media", deps: []
 * createTable "Roles", deps: []
 * createTable "Terms", deps: []
 * createTable "Universities", deps: []
 * createTable "YoutubeChannels", deps: []
 * createTable "Courses", deps: [Depts]
 * createTable "Offerings", deps: [Terms, Depts, Universities]
 * createTable "CourseOfferings", deps: [Courses, Offerings]
 * createTable "CourseOfferingMedia", deps: [CourseOfferings, Media]
 * createTable "Users", deps: [Universities]
 * createTable "Lectures", deps: [Offerings, Media]
 * createTable "MSTranscriptionTasks", deps: [Users, Media]
 * createTable "UpdationJobs", deps: [CourseOfferings]
 * createTable "TaskMedia", deps: [MSTranscriptionTasks, Media]
 * createTable "UserOfferings", deps: [Users, CourseOfferings, Roles]
 *
 **/

var info = {
    "revision": 1,
    "name": "initial",
    "created": "2019-03-05T23:54:51.540Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Depts",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "deptName": {
                    "type": Sequelize.TEXT,
                    "field": "deptName"
                },
                "acronym": {
                    "type": Sequelize.TEXT,
                    "field": "acronym"
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
    },
    {
        fn: "createTable",
        params: [
            "EchoSections",
            {
                "sectionId": {
                    "type": Sequelize.UUID,
                    "field": "sectionId",
                    "primaryKey": true
                },
                "courseId": {
                    "type": Sequelize.TEXT,
                    "field": "courseId"
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
    },
    {
        fn: "createTable",
        params: [
            "Media",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "primaryKey": true,
                    "autoIncrement": true
                },
                "videoURL": {
                    "type": Sequelize.TEXT,
                    "field": "videoURL"
                },
                "sourceType": {
                    "type": Sequelize.TINYINT,
                    "field": "sourceType"
                },
                "siteSpecificJSON": {
                    "type": Sequelize.TEXT,
                    "field": "siteSpecificJSON"
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
    },
    {
        fn: "createTable",
        params: [
            "Roles",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "roleName": {
                    "type": Sequelize.TEXT,
                    "field": "roleName"
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
    },
    {
        fn: "createTable",
        params: [
            "Terms",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "termName": {
                    "type": Sequelize.TEXT,
                    "field": "termName"
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
    },
    {
        fn: "createTable",
        params: [
            "Universities",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "universityName": {
                    "type": Sequelize.TEXT,
                    "field": "universityName"
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
    },
    {
        fn: "createTable",
        params: [
            "YoutubeChannels",
            {
                "playlistId": {
                    "type": Sequelize.UUID,
                    "field": "playlistId",
                    "primaryKey": true
                },
                "channelId": {
                    "type": Sequelize.TEXT,
                    "field": "channelId"
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
    },
    {
        fn: "createTable",
        params: [
            "Courses",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "courseNumber": {
                    "type": Sequelize.TEXT,
                    "field": "courseNumber"
                },
                "courseName": {
                    "type": Sequelize.TEXT,
                    "field": "courseName"
                },
                "courseDescription": {
                    "type": Sequelize.TEXT,
                    "field": "courseDescription"
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
                },
                "deptId": {
                    "type": Sequelize.UUID,
                    "field": "deptId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Depts",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Offerings",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "section": {
                    "type": Sequelize.TEXT,
                    "field": "section"
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
                },
                "termId": {
                    "type": Sequelize.UUID,
                    "field": "termId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Terms",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "deptId": {
                    "type": Sequelize.UUID,
                    "field": "deptId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Depts",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "universityId": {
                    "type": Sequelize.UUID,
                    "field": "universityId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Universities",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "CourseOfferings",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
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
                },
                "courseId": {
                    "type": Sequelize.UUID,
                    "field": "courseId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Courses",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "offeringId": {
                    "type": Sequelize.UUID,
                    "field": "offeringId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Offerings",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "CourseOfferingMedia",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "descpJSON": {
                    "type": Sequelize.TEXT,
                    "field": "descpJSON"
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
                },
                "courseOfferingId": {
                    "type": Sequelize.UUID,
                    "field": "courseOfferingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "CourseOfferings",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "mediaId": {
                    "type": Sequelize.INTEGER,
                    "field": "mediaId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Media",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "mailId": {
                    "type": Sequelize.TEXT,
                    "field": "mailId"
                },
                "firstName": {
                    "type": Sequelize.TEXT,
                    "field": "firstName"
                },
                "lastName": {
                    "type": Sequelize.TEXT,
                    "field": "lastName"
                },
                "password": {
                    "type": Sequelize.TEXT,
                    "field": "password"
                },
                "passwordToken": {
                    "type": Sequelize.TEXT,
                    "field": "passwordToken"
                },
                "verified": {
                    "type": Sequelize.BOOLEAN,
                    "field": "verified"
                },
                "verifiedId": {
                    "type": Sequelize.TEXT,
                    "field": "verifiedId"
                },
                "google": {
                    "type": Sequelize.TEXT,
                    "field": "google"
                },
                "googleId": {
                    "type": Sequelize.TEXT,
                    "field": "googleId"
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
                },
                "universityId": {
                    "type": Sequelize.UUID,
                    "field": "universityId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Universities",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Lectures",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "date": {
                    "type": Sequelize.DATEONLY,
                    "field": "date"
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
                },
                "offeringId": {
                    "type": Sequelize.UUID,
                    "field": "offeringId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Offerings",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "mediaId": {
                    "type": Sequelize.INTEGER,
                    "field": "mediaId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Media",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "MSTranscriptionTasks",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "videoLocalLocation": {
                    "type": Sequelize.TEXT,
                    "field": "videoLocalLocation"
                },
                "audioLocalLocation": {
                    "type": Sequelize.TEXT,
                    "field": "audioLocalLocation"
                },
                "videoHashsum": {
                    "type": Sequelize.TEXT,
                    "field": "videoHashsum"
                },
                "audioHashsum": {
                    "type": Sequelize.TEXT,
                    "field": "audioHashsum"
                },
                "wavAudioLocalFile": {
                    "type": Sequelize.TEXT,
                    "field": "wavAudioLocalFile"
                },
                "wavHashsum": {
                    "type": Sequelize.TEXT,
                    "field": "wavHashsum"
                },
                "srtFileLocation": {
                    "type": Sequelize.TEXT,
                    "field": "srtFileLocation"
                },
                "log": {
                    "type": Sequelize.TEXT,
                    "field": "log"
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
                },
                "taskCreatorUserId": {
                    "type": Sequelize.UUID,
                    "field": "taskCreatorUserId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "mediaId": {
                    "type": Sequelize.INTEGER,
                    "field": "mediaId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Media",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "UpdationJobs",
            {
                "id": {
                    "type": Sequelize.UUID,
                    "field": "id",
                    "primaryKey": true
                },
                "startDate": {
                    "type": Sequelize.DATEONLY,
                    "field": "startDate"
                },
                "endDate": {
                    "type": Sequelize.DATEONLY,
                    "field": "endDate"
                },
                "sourceType": {
                    "type": Sequelize.TINYINT,
                    "field": "sourceType"
                },
                "url": {
                    "type": Sequelize.TEXT,
                    "field": "url"
                },
                "params": {
                    "type": Sequelize.TEXT,
                    "field": "params"
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
                },
                "courseOfferingId": {
                    "type": Sequelize.UUID,
                    "field": "courseOfferingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "CourseOfferings",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "TaskMedia",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
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
                },
                "taskId": {
                    "type": Sequelize.UUID,
                    "field": "taskId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "MSTranscriptionTasks",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "mediaId": {
                    "type": Sequelize.INTEGER,
                    "field": "mediaId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Media",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "UserOfferings",
            {
                "id": {
                    "type": Sequelize.INTEGER,
                    "field": "id",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
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
                },
                "userId": {
                    "type": Sequelize.UUID,
                    "field": "userId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "courseOfferingId": {
                    "type": Sequelize.UUID,
                    "field": "courseOfferingId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "CourseOfferings",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "roleId": {
                    "type": Sequelize.UUID,
                    "field": "roleId",
                    "onUpdate": "CASCADE",
                    "onDelete": "SET NULL",
                    "references": {
                        "model": "Roles",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
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
