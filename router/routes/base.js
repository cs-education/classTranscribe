var router = express.Router();
var fs = require('fs');

var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
});


var loginHomePage = fs.readFileSync(mustachePath + 'dashboard.mustache').toString();
router.get('/dashboard', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(loginHomePage, request, response);
});

module.exports = router;
