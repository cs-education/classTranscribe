

var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
router.get('/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    if (!isClassNameValid(className)) {
      var invalidClassHTML = "<p>Could not find the requested page.<\p> <a href=\"/\">Click here to return to the home page.</a>";
      response.end(invalidClassHTML);
      return;
    }

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
