/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 // Use Passport logout function, to stop user session and redirect to the homepage
router.get('/logout', function(request, response) {
  request.logout();
  response.redirect('/');
});

module.exports = router;
