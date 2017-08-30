/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Allows piwik to be served over https
// Open on PROXY_PORT

var httpProxy = require("http-proxy");
var fs = require("fs");
var dotenv = require('dotenv');

dotenv.load();
var httpsPort =  process.env.PROXY_PORT || 7443;
var piwikPort =  process.env.PIWIK_PORT || 7001;
var piwikHost = "192.17.96.13";

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
