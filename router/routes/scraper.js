/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
var fs = require('fs');
var scraper = require('../../modules/scraper_utils');
var scraperMustache = fs.readFileSync(mustachePath + 'scraper.mustache').toString();

router.get('/scraper', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    console.log(request.query.channelId);
    scraper.youtube_scraper_channel(request.query.channelId)
        .then(function (playlists) {
            console.log(playlists);
        });
    renderWithPartial(scraperMustache, request, response);
});

router.get('/scraperEchoSection', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text.html'
    });
    scraper.download_course_info_2('https://echo360.org/section/286c2340-3852-469d-ba1c-f2cb3f1e2636')
    renderWithPartial(scraperMustache, request, response);
});

module.exports = router;
