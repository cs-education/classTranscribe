/*
    /viewer

 */

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
router.get('/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
    });

    var view = {
      className: className,
      // ***
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    };
    var html = Mustache.render(viewerMustache, view, {
      partial: authenticatedPartial
    });
    response.end(html);
  });

  module.exports = router;