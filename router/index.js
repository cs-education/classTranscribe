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
    const router = express.Router();

    app.use(require('./routes/base'));
    app.use(require('./routes/login'));
    app.use(require('./routes/logout'));
    app.use(require('./routes/download'));
    app.use(require('./routes/search'));
    app.use(require('./routes/viewer'));

    app.use(require('./routes/watchLectureVideos'));
    app.use(require('./routes/courses'));
    app.use(require('./routes/scraper'));
}




//const authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
//const notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.mustache').toString();
//const adminPartial = fs.readFileSync(mustachePath + 'admin.mustache').toString();
const invalidClassHTML = "<p>Could not find the requested page.<\p> <a href=\"/\">Click here to return to the home page.</a>";

const piwikServer = "192.17.96.13:" + process.env.PROXY_PORT;

renderWithPartial = function(mustacheFile, request, response, params) {
  //console.log('getMustacheTemplate 1= ' + Mustache.getMustacheTemplate('authenticated.mustache'));
  //console.log('getMustacheTemplate 2= ' + Mustache.getMustacheTemplate('notAuthenticated.mustache'));
  
  var html;
  var options = {};
  options["piwikServer"] = piwikServer;
  for (var key in params) {
    options[key] = params[key];
  }
  if (request.isAuthenticated()) {
    options["user"] = request.user["urn:oid:0.9.2342.19200300.100.1.1"];

    html = Mustache.render(mustacheFile, options, {
        loginPartial: Mustache.getMustacheTemplate('authenticated.mustache')
      })
  }
  else {
    options["user"] = null;
    html = Mustache.render(mustacheFile, options,  {
        list: {},
        loginPartial: Mustache.getMustacheTemplate('notAuthenticated.mustache')
      })
  }
  response.end(html);
}
