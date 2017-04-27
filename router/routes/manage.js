
var router = express.Router();
var fs = require('fs');

var manageCoursePage = fs.readFileSync(mustachePath + 'manageCourse.mustache').toString();
app.get('/manageCourse', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  var html = Mustache.render(manageCoursePage);
  response.end(html);
});