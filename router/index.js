module.exports = function(app) {

/*
	Pretty sure that order matters here.
	There's probably a way to better enforce it, though.

*/


//    app.use('/login', require('./routes/login'));
    app.use(require('./routes/base'));
    app.use(require('./routes/login'));
    app.use(require('./routes/logout'));
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
}

authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.html').toString();

renderWithPartial = function(mustacheFile, request, response) {
  var html;
  if (request.isAuthenticated()) {
    html = Mustache.render(mustacheFile, {
      list: [
        { user: request.user["urn:oid:0.9.2342.19200300.100.1.1"],
    port: process.env.PIWIK_PORT }
]
    }, {
        partial: authenticatedPartial
      })
  }
  else {
    html = Mustache.render(mustacheFile,
      {
        list: [{ user: null , port: process.env.PIWIK_PORT}]
      }, {
        partial: notAuthenticatedPartial
      })
  }
  response.end(html);
}
