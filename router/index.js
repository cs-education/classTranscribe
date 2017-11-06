/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
module.exports = function(app) {
/*
	Pretty sure that order matters here.
	There's probably a way to better enforce it, though.

*/
    var router = express.Router();

    app.use(require('./routes/base'));
    app.use(require('./routes/admin'));
    app.use(require('./routes/signup'));
    app.use(require('./routes/login'));
    app.use(require('./routes/logout'));
    app.use(require('./routes/resetPassword'));
    app.use(require('./routes/changePassword'));
    app.use(require('./routes/accountRecovery'));
    app.use(require('./routes/activated'));
    app.use(require('./routes/first'));
    app.use(require('./routes/progress'));
    app.use(require('./routes/viewProgress'));
    app.use(require('./routes/download'));
    app.use(require('./routes/queue'));
    app.use(require('./routes/second'));
    app.use(require('./routes/search'));
    app.use(require('./routes/video'));
    app.use(require('./routes/viewer'));
    app.use(require('./routes/captions'));
    app.use(require('./routes/manage'));
    app.use(require('./routes/watchLectureVideos'));
}

authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.mustache').toString();
adminPartial = fs.readFileSync(mustachePath + 'admin.mustache').toString();


var piwikServer = "192.17.96.13:" + process.env.PROXY_PORT;

renderWithPartial = function(mustacheFile, request, response, params) {
  var html;
  var options = {};
  options["piwikServer"] = piwikServer;
  for (var key in params) {
    options[key] = params[key];
  }
  if (request.isAuthenticated()) {
    options["user"] = request.user["urn:oid:0.9.2342.19200300.100.1.1"];
    
    html = Mustache.render(mustacheFile, options, {
        loginPartial: authenticatedPartial
      })
  }
  else {
    options["user"] = null;
    html = Mustache.render(mustacheFile, options,  {
        list: {},
        loginPartial: notAuthenticatedPartial
      })
  }
  response.end(html);
}

isClassNameValid = function(className) {

  var classes = [
    "cs241", "cs225", "cs225-sp16", "cs446-fa16", "adv582", "ece210", "chem233-sp16"
  ]

  if (classes.indexOf(className) >= 0) {
    return true;
  }

  return false;
}

invalidClassHTML = "<p>Could not find the requested page.<\p> <a href=\"/\">Click here to return to the home page.</a>";
