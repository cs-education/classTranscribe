/*
    /logout
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
