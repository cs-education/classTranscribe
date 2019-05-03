const fs = require('fs');
const db = require('../db/db');

const logging = require('../utils/logging');
const utils = require('../utils/utils');
const vttToJson = require('../modules/vtt-json');
const perror = logging.perror;
const info = logging.info;
const log = logging.log;
var dateformat = require('dateformat');

//const watchLectureVideosPage = fs.readFileSync(mustachePath + 'watchLectureVideos.mustache').toString();


router.get('/watchLectureVideos/:courseOfferingId', function (request, response) {
    if (request.isAuthenticated()) {

        response.writeHead(200, {
            'Content-Type': 'text/html'
        });

    renderWithPartial(Mustache.getMustacheTemplate('watchLectureVideos.mustache'), request, response);
  } else {
      response.redirect('/login?redirectPath=' + encodeURIComponent(request.originalUrl));
  }
});

router.get('/getPlaylist/:courseOfferingId', function (request, response) {
    var courseOfferingId = request.params.courseOfferingId;
    var ctr = 1;
    db.getPlaylistByCourseOfferingId(courseOfferingId).then(
        values => {
            var playlist = values.map(result => {
                let video = {};
                let des = JSON.parse(result.siteSpecificJSON);
                if (result['sourceType'] == 0) {
                    video['name'] = ctr++ + ": " + dateformat(result['createdAt'], "mm-dd-yyyy");
                } else if (result['sourceType'] == 2) {
                    var sitespecifcJSON = JSON.parse(result['siteSpecificJSON']);
                    video['name'] = ctr++ + ": " + dateformat(result['createdAt'], "mm-dd-yyyy") + ": " + sitespecifcJSON.lessonName;
                }
                else {// if youtube
                    video['name'] = des.title;
                }
                var sources = [{ src: result['videoLocalLocation'], type: 'video/mp4' , "label":"View 1"}];
                if(result['altVideoLocalLocation'] != null && result['altVideoLocalLocation'].length > 0) {
                    sources.push({ src: result['altVideoLocalLocation'], type: 'video/mp4', "label":"View 2" })
                }
                
                video['sources'] = sources;
                video['textTracks'] = [{ src: result['srtFileLocation'], srclang: 'eng', label: 'English' }];
                video['thumbnail'] = false;
                return video;
            });
            response.json(playlist);
        });
});

router.get('/getSrts/:courseOfferingId', async function (request, response) {

    var courseOfferingId = request.params.courseOfferingId;

    counter = 0;
    var allSubs = await db.getPlaylistByCourseOfferingId(courseOfferingId).then(
        async function (values) {
            var allSubs = [];
            await utils.asyncForEach(values, async function (value) {
                var subctr = 0;
                try {                    
                    var subFile = value['srtFileLocation'];
                    var videoFile = value['videoLocalLocation'];
                    let results = await vttToJson(subFile);
                    await utils.asyncForEach(results, async function (result) {
                        if (result.subtitles.length > 0) {
                        result.part = result.subtitles[0];
                        } else {
                        result.part = ''
                        }
                        result.createdAt = value.createdAt;
                        result.subFile = subFile;
                        result.video = videoFile;
                        result.subId = subctr++;
                        result.id = counter++;
                        allSubs.push(result);
                    });
                } catch(err) {
                    console.log(err);
                }
            });
            return allSubs;
        }).catch(err => { perror(err); });

    response.json(allSubs);
});

router.post('/submitEdit', async function (request, response) {
    console.log(request.body);
    utils.transferJsonToVtt(request.body.sub, request.body.subFile);
    response.json({
        success: true
    });
});

module.exports = router;
