var redis = require("redis");
var redisHost = process.env.REDIS_HOST;
var redisPass = process.env.REDIS_PASS;

if (!redisPass) throw "Need a password in environmental variables!";

module.exports = redis.createClient(6379, redisHost, {auth_pass: redisPass});