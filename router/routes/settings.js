/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const db = require('../../db/db');

//const settingsMustache = fs.readFileSync(mustachePath + 'settings.mustache').toString();


const utils = require('../../utils/logging');
const perror = utils.perror;

router.get('/settings', function(request, response) {
  if (request.isAuthenticated()) {
    response.writeHead(200, {
      'Content-Type': 'text.html'
    });

    var userInfo = request.user;
    var html = Mustache.render(Mustache.getMustacheTemplate('settings.mustache'), {first_name : userInfo.firstName, last_name : userInfo.lastName });
    response.end(html);
  } else {
      response.redirect('/auth/google?redirectPath=' + encodeURIComponent(request.originalUrl));
  }
});

router.post('/settings/submit', function(request, response) {
  var name = {
    firstName : request.body.first_name,
    lastName : request.body.last_name,
  }
  var mailId = request.user.mailId;

  // Edit user information in database
  db.setUserName(name, mailId).then(()=>{
    response.send({ message : 'success', html: '../dashboard'});
  }).catch(err => {
    perror(err);
    response.send({ message : err, html : '../dashboard'});
  });
});

module.exports = router;
