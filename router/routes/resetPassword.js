var router = express.Router();
var fs = require('fs');

var resetPasswordMustache = fs.readFileSync(mustachePath + 'resetPassword.mustache').toString();

router.get('/resetPassword', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    renderWithPartial(resetPasswordMustache, request, response);
});

module.exports = router;