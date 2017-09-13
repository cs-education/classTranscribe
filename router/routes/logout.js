/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

router.get('/logout', function (req, res) {
  if (usersaml != null) {
    //Here add the nameID and nameIDFormat to the user if you stored it someplace.
    req.user = {};
    req.user.nameID = usersaml.nameID;
    req.user.nameIDFormat = usersaml.nameIDFormat;
    samlStrategy.logout(req, function (err, request) {
      if (!err) {
        //redirect to the IdP Logout URL
        req.session.destroy(function (err) {
          req.logout();
          res.clearCookie('connect.sid');
          res.redirect(request);
        });
      }
    });
  }
});

module.exports = router;
