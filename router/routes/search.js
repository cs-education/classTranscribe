/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
router.get('/:className',
  ensureAuthenticated,
  function (request, response) {
    var className = request.params.className.toLowerCase();

    if (!isClassNameValid(className)) {
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
