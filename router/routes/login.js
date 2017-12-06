/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var client = require('./../../modules/redis');

var loginMustache = fs.readFileSync(mustachePath + 'login.mustache').toString();






router.get('/login', function(request, response) {


    if(request.isAuthenticated()){
        response.redirect('../dashboard');
    }
    else {
        response.writeHead(200, {
            'Content-Type': 'text.html'
        });
        renderWithPartial(loginMustache, request, response);
    }
});

router.post('/login/submit',passport.authenticate('local',{ successRedirect: '../dashboard', failureRedirect: '/login' }),
    function(request, response) {
    var email = request.body.email;
    var password = request.body.password;
    // Handled in LocalStrategy for now

    // Check if email is already in the database
    //client.hgetall("ClassTranscribe::Users::" + email, function(err, obj) {
    //    if (!obj) {
    //        var error = "Account does not exist";
    //        console.log(error);
    //        // response.send(error);
    //        response.end();
    //    } else {
    //        // Verify the inputted password is same equal to the password stored in the database
    //        client.hget("ClassTranscribe::Users::" + email, "password", function(err, obj) {
    //            if (obj != password) {
    //                var error = "Invalid password";
    //                console.log(error);
    //                // response.send(error);
    //                response.end();
    //            } else {
    //                response.redirect('../dashboard');
    //                passport.authenticate('local',function(req, res){
    //                    console.log('login success');
    //                });
    //            }
    //        });
    //    }
    //});
});


// for demo only
router.post('/logout', function(req, res) {

    req.logout();
    res.redirect('/');
});





module.exports = router;