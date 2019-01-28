/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const router = express.Router();
const fs = require('fs');
const passport = require('passport')

// Get the mustache page that will be rendered for the login route
//const loginMustache = fs.readFileSync(mustachePath + 'login.mustache').toString();

// Render the login mustache page; if account is authenticated, just bring user to dashboard
router.get('/login', function(request, response) {
    if (request.isAuthenticated()) {
        response.redirect('../courses');
    } else {
        response.redirect('../auth/google');

        // response.writeHead(200, {
        //     'Content-Type': 'text.html'
        // });
        // renderWithPartial(Mustache.getMustacheTemplate('login.mustache'), request, response);
    }
});

// Use Passport to authentication the login information
router.post('/login/submit', function(request, response, next) {
    passport.authenticate('local', function(err, user, info) {
      // Display error if failed to login; otherwise, redirect to dashboard
      if (!user) {
        response.send({ message: info.message, html: '../login'});
      } else {
        request.logIn(user, function(err) {
          response.send({ message: 'success', html: '../courses' });
        });
      }
    })(request, response, next);
});

router.get('/auth/google',
    function (req, res, next) {
        passport.authenticate('google', {
            scope: ['profile', 'email'],
            state: req.query.redirectPath
        })(req, res, next);
    });



router.get('/auth/google/callback', function (req, res, next) {
    passport.authenticate('google', function (err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.send({ message: info.message, html: '/' })
        }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            if (typeof req.query.state != "undefined" && req.query.state.length > 0) {
                return res.redirect(req.query.state);
            }
            return res.redirect('/courses');
        });
    })(req, res, next);
});



module.exports = router;
