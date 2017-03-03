module.exports = function(app) {
    app.use('/', require('./routes/base'));
    app.use('/first', require('./routes/first'));
    app.use('/progress', require('./routes/progress'));
    app.use('/viewProgress', require('./routes/viewProgress'));
    app.use('/download', require('./routes/download'));
    app.use('/queue', require('./routes/queue'));
    app.use('/second', require('./routes/second'));
    app.use('/login', require('./routes/login'));
    app.use('/search', require('./routes/search'));
    app.use('/video', require('./routes/video'));
    app.use('/viewer', require('./routes/viewer'));
    app.use('/captions', require('./routes/captions'));
    app.use('/logout', require('./routes/logout'));
}

var authenticatedPartial = fs.readFileSync(mustachePath + 'authenticated.mustache').toString();
var notAuthenticatedPartial = fs.readFileSync(mustachePath + 'notAuthenticated.html').toString();

renderWithPartial = function(mustacheFile, request, response) {
  var html;
  if (request.isAuthenticated()) {
    html = Mustache.render(mustacheFile, {
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    }, {
        partial: authenticatedPartial
      })
  }
  else {
    html = Mustache.render(mustacheFile,
      {
        list: [{ user: null }]
      }, {
        partial: notAuthenticatedPartial
      })
  }
  response.end(html);
}
