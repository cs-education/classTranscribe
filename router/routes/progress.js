var router = express.Router();

var progressMustache = fs.readFileSync(mustachePath + 'progress.mustache').toString();
router.get('/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className,
  };
  var html = Mustache.render(progressMustache, view);

  response.end(html);
});

router.post('/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId;
  sendProgressEmail(className, netId, function () {
    response.end('success');
  });
});

function sendProgressEmail(className, netId, callback) {
  client.smembers("ClassTranscribe::First::" + className, function (err, firstMembers) {
    if (err) {
      console.log(err);
    }

    client.smembers("ClassTranscribe::Finished::" + className, function (err, finishedMembers) {
      if (err) {
        console.log(err);
      }

      var count = 0;
      firstMembers.forEach(function (member) {
        var user = member.split("-")[1].replace(".json", "").replace(".txt", "");
        if (user === netId) {
          count++;
        }
      });

      finishedMembers.forEach(function (member) {
        var user = member.split("-")[1].replace(".json", "").replace(".txt", "");
        if (user === netId) {
          count++;
        }
      });

      mailer.progressEmail(netId, className, count);
      if (callback) {
        callback();
      }
    });
  });
}

module.exports = router;