var router = express.Router();
var fs = require('fs');

var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
});

module.exports = router;
