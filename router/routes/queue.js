var router = express.Router();

var queueMustache = fs.readFileSync(mustachePath + 'queue.mustache').toString();
router.get('/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className
  };

  var html = Mustache.render(queueMustache, view);
  response.end(html);
});

router.get('/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId.toLowerCase();

  var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "LIMIT", "0", "1"];
  client.zrangebyscore(args, function (err, result) {
    if (err) {
      throw err;
    }

    if (!result.length) {
      return response.end("No more tasks at the moment. More tasks are being uploaded as you read this. Please check back later.");
    }

    var taskName = result[0];
    // var fileName = chosenTask + "-" + netId + ".txt";

    args = ["ClassTranscribe::Tasks::" + className, "1", result[0]];
    client.zincrby(args);

    response.end(taskName);
  });
});

module.exports = router;