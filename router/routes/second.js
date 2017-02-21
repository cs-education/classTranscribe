var router = express.Router();

var secondPassMustache = fs.readFileSync(mustachePath + 'editor.mustache').toString();
router.get('/:className/:id', function (request, response) {
  var className = request.params.className.toUpperCase();
  response.writeHead(200, {
    'Content-Type': 'text/html',
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
  });

  var view = {
    className: className,
    taskName: request.query.task,
  };
  var html = Mustache.render(secondPassMustache, view);
  response.end(html);
});

module.exports = router;