/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var redis = require("redis");
var redisHost = process.env.REDIS_HOST;
var redisPass = process.env.REDIS_PASS;

if (!redisPass) throw "Need a password in environmental variables!";

/*
    TODO: Check to make sure this is fine
*/
var client = redis.createClient(6379, redisHost, { auth_pass: redisPass });
client.on("monitor", function (time, args, raw_reply) {
    console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
});

client.on('error', function (error) {
    console.log(error);
});

module.exports = client;