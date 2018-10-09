/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

//var router = express.Router();
var api = require('./api')
var client_api = new api();

var progressMustache = fs.readFileSync(mustachePath + 'progress.mustache').toString();
router.get('/progress/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className,
  };
  var html = Mustache.render(progressMustache, view);

  response.end(html);
});

router.post('/progress/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId;
  sendProgressEmail(className, netId, function () {
    response.end('success');
  });
});

function sendProgressEmail(className, netId, callback) {
  client_api.getFirst(className, function(err, firstMembers) {
  // client.smembers("ClassTranscribe::First::" + className, function (err, firstMembers) {
    if (err) {
      console.log(err);
    }

    client_api.getFinished(className, function(err, finishedMembers) {
    // client.smembers("ClassTranscribe::Finished::" + className, function (err, finishedMembers) {
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
