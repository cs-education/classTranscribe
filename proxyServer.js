var httpProxy = require("http-proxy");
var fs = require("fs");
var dotenv = require('dotenv');

dotenv.load();

/*
var basePort = process.env.npm_package_config_basePort;
var addProxyPort = process.env.npm_package_config_addProxyPort;
var addPiwikPort = process.env.npm_package_config_addPiwikPort;
*/

var httpsPort =  process.env.PROXY_PORT || 7443;
var piwikPort =  process.env.PIWIK_PORT || 7001;
var piwikHost = "localhost";

var options = {
    target: {
        host: piwikHost,
        port: piwikPort
    },
    ssl: {
        key: fs.readFileSync("./cert/key.pem"),
        cert: fs.readFileSync("./cert/cert.pem")
    }
}

httpProxy.createServer(options).listen(httpsPort, function() {
    console.log("https Proxy server on: " + httpsPort);
})