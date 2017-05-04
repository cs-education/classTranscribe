// var router = express.Router();
var fs = require('fs');

var manageCoursePage = fs.readFileSync(mustachePath + 'manageCourse.mustache').toString();
router.get('/manageCourse', function (request, response) {
console.log("Got ROUTE", manageCoursePage)
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(manageCoursePage, request, response);
});

module.exports = router;