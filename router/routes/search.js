/*
    /search
*/

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
router.get('/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    response.writeHead(200, {
      'Content-Type': 'text/html'
    });

    var view = {
      className: className,
      exampleTerm: exampleTerms[className]
    };

    renderWithPartial(searchMustache, request, response, view);
  });

  module.exports = router;
