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

    /*        html = Mustache.render(mustacheFile, {
          list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
        }, {
            partial: authenticatedPartial
          })
    */
    var view = {
      className: className,
      exampleTerm: exampleTerms[className],
      // ***
      list: [{ user: request.user["urn:oid:0.9.2342.19200300.100.1.1"] }]
    };
    var html = Mustache.render(searchMustache, view, {
      partial: authenticatedPartial
    });
    response.end(html);
  });

  module.exports = router;
