/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// Used to redirect http -> https

var express = require('express');
var http = require('http');

var dotenv = require('dotenv');
dotenv.load();

var app = express();

app.get('*', function (req, res) {
    res.redirect('https://' + req.headers.host + req.url);
});

var port = process.env.REDIRECT_PORT || 7000;
var redirectServer = http.createServer(app);
redirectServer.listen(port, function() {
    console.log("listening on " + port);
});
