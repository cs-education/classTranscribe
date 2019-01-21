/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// captions
const fs = require('fs');
/* TODO: rework this part, captionMapping is hardcoded in server.js */
captionsMapping = [];
router.get('/captions/:offeringId/:index', function (request, response) {
  var offeringId = request.params.offeringId;
  var captions = captionsMapping[offeringId];

  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var index = parseInt(request.params.index);
  response.end(JSON.stringify({ captions: captions[index] }));
});

module.exports = router;
