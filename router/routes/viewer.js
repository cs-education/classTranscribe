/*
    /viewer

 */

var viewerMustache = fs.readFileSync(mustachePath + 'viewer.mustache').toString();
router.get('/viewer/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    if (!isClassNameValid(className)) {
      response.end(invalidClassHTML);
      return;
    }

    response.writeHead(200, {
      'Content-Type': 'text/html',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
    });

    var view = {
        className: className
    };
    renderWithPartial(viewerMustache, request, response, view);
  });

  module.exports = router;
