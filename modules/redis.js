var redis = require("redis");
var redisPass = process.env.REDIS_PASS;

if (!redisPass) throw "Need a password in environmental variables!";

module.exports = redis.createClient(6379, '54.148.52.89', {auth_pass: redisPass});