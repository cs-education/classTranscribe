// var router = express.Router();
var searchMustache = fs.readFileSync(mustachePath + 'search.mustache').toString();
// router.get('/:className',
//   ensureAuthenticated,
router.get('/class/:className',
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
