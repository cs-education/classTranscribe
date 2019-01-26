/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const client_api = require('./db');

//const progressDashboardMustache = fs.readFileSync(mustachePath + 'progressDashboard.mustache').toString();

router.get('/viewProgress/:className/:uuid', function (request, response) {
  var className = request.params.className;
  var uuid = request.params.uuid;

  var isMemberArgs = ['ClassTranscribe::AllowedUploaders', uuid]
  client_api.getMemberArgs(isMemberArgs, function(err, result) {
  // client.sismember(isMemberArgs, function (err, result) {
    if (result) {
      progressDict = {}
      client_api.getFirst(className, function(err, firstMembers) {
      // client.smembers("ClassTranscribe::First::" + className, function (err, firstMembers) {
        if (err) {
          console.log(err);
        }
        client_api.getFinished(className, function(err,finishedMembers) {
        // client.smembers("ClassTranscribe::Finished::" + className, function (err, finishedMembers) {
          if (err) {
            console.log(err);
          }

          firstMembers.forEach(function (member) {
            var netID = member.split("-")[1].replace(".json", "").replace(".txt", "");
            if (progressDict.hasOwnProperty(netID)) {
              progressDict[netID] = progressDict[netID] + 1;
            } else {
              progressDict[netID] = 1;
            }
          });

          finishedMembers.forEach(function (member) {
            var netID = member.split("-")[1].replace(".json", "").replace(".txt", "");
            if (progressDict.hasOwnProperty(netID)) {
              progressDict[netID] = progressDict[netID] + 1;
            } else {
              progressDict[netID] = 1;
            }
          });

          var studentProgress = []
          for (netID in progressDict) {
            if (progressDict.hasOwnProperty(netID) && netID !== 'omelvin2') {
              studentProgress.push({ 'netID': netID, 'count': progressDict[netID] });
            }
          }

          response.writeHead(200, {
            'Content-Type': 'text/html'
          });

          var view = {
            className: className,
            studentProgress: studentProgress
          };
          var html = Mustache.render(Mustache.getMustacheTemplate('progressDashboard.mustache'), view);
          response.end(html);
        });
      });
    }
  })
});

module.exports = router;
