/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const router = express.Router();
const db = require('../../db/db');

//const queueMustache = fs.readFileSync(mustachePath + 'queue.mustache').toString();



router.get('/queue/:className', function (request, response) {
  var className = request.params.className.toUpperCase();

  var view = {
    className: className
  };

  var html = Mustache.render(Mustache.getMustacheTemplate('queue.mustache'), view);
  response.end(html);
});

router.get('/queue/:className/:netId', function (request, response) {
  var className = request.params.className.toUpperCase();
  var netId = request.params.netId.toLowerCase();

  // var args = ["ClassTranscribe::Tasks::" + className, "0", "99999", "LIMIT", "0", "1"];
  db.getTasks(className, function(err, result) {
  // client.zrangebyscore(args, function (err, result) {
    if (err) {
      throw err;
    }
    console.log('result: ', result);
    if (!result.length) {
      return response.end("No more tasks at the moment. More tasks are being uploaded as you read this. Please check back later.");
    }

    var taskName = result[0];
    // var fileName = chosenTask + "-" + netId + ".txt";

    // args = ["ClassTranscribe::Tasks::" + className, "1", result[0]];
    // client.zincrby(args);
    db.getsortedTask(className, taskName);

    response.end(taskName);
  });
});

module.exports = router;
