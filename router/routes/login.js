var router = express.Router();
var fs = require('fs');

var loginMustache = fs.readFileSync(mustachePath + 'login.mustache').toString();

router.get('/login', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(loginMustache, request, response);
});

module.exports = router;