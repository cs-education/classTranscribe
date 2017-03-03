//var router = express.Router();

router.get('/login',
  passport.authenticate('saml', { failureRedirect: '/login/fail' }),
  function (req, res) {
    // TODO: change login redirect?
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
