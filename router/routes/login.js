/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
router.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function (req, res) {
    res.redirect('/');
  }
);

router.post('/login/callback',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function (req, res) {
    /*
        User information in: req["user"]
    
     */
    var redirectUrl = samlStrategy['Redirect'];
    if (redirectUrl != null) {
      res.redirect(redirectUrl);
    }
    else {
      res.redirect('/');
    }
  }
);

router.get('/login/fail',
  function (req, res) {
    res.status(401).send('Login failed');
  }
);

module.exports = router;
