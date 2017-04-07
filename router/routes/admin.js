var router = express.Router();
var fs = require('fs');

var adminMustache = fs.readFileSync(mustachePath + 'admin.mustache').toString();

router.get('/admin', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(adminMustache, request, response);
});

module.exports = router;
