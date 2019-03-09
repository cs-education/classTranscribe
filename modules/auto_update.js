'use strict';
var db = require('../db/db');
var scraper_utils = require('./scraper_utils');
var utils = require('../utils/utils');

async function addJobs() {
    var ece110 = {
        startDate: utils.stringToDate("2019-01-01"),
        endDate: utils.stringToDate("2019-05-10"),
        sourceType: 0,
        url: 'https://echo360.org/section/2fdcac9e-ba40-45ed-af82-4cb9c2f3ed62/public',
        courseOfferingId: 'c48ca8d2-a7a7-40b2-86c5-14bfa0630e0e',
        params: JSON.stringify({
            stream: 1
        })
    };

    var cs125 = {
        startDate: utils.stringToDate("2019-01-01"),
        endDate: utils.stringToDate("2019-05-10"),
        sourceType: 1,
        url: 'PLi9J8D4T_-po13lr8381OFhWqmE_xHDoO',
        courseOfferingId: 'd7cc293f-8898-4678-9061-33b25298786a'
    };

    var cs450 = {
        startDate: utils.stringToDate("2019-01-01"),
        endDate: utils.stringToDate("2019-05-10"),
        sourceType: 0,
        url: 'https://echo360.org/section/64c7ddf3-deb3-4cbc-a342-230b413b41e1/public',
        courseOfferingId: 'f33cabc4-fef0-4232-9e43-067aaf907abc',
        params: JSON.stringify({
            stream: 0
        })
    };

    var cs374 = {
        startDate: utils.stringToDate("2019-01-01"),
        endDate: utils.stringToDate("2019-05-10"),
        sourceType: 0,
        url: 'https://echo360.org/section/cb9ce139-834e-436e-8e3d-691af8111d2f/public',
        courseOfferingId: '44414e59-8753-4e54-94ce-914cba3bb1fb',
        params: JSON.stringify({
            stream: 0
        })
    };

    var cs125old = {
        startDate: utils.stringToDate("2018-12-01"),
        endDate: utils.stringToDate("2018-12-31"),
        sourceType: 1,
        url: 'PLi9J8D4T_-pqnWHhc67TDbZQiyPWPMnmV',
        courseOfferingId: 'a77cb3b5-28d5-4f65-ba80-86d75435ada8',
        params: JSON.stringify({
            stream: 0
        })
    };

    var jobs = [];
    jobs.push(ece110);
    jobs.push(cs125);
    jobs.push(cs450);
    jobs.push(cs374);
    jobs.push(cs125old);

    await utils.asyncForEach(jobs, async function (job) {
        await db.addUpdationJob(job);
    });
}

async function runSpring2019Jobs() {
    var jobs = await db.getUpdationJobsBetween(utils.stringToDate("2019-01-01"),
        utils.stringToDate("2019-12-31"));
    await utils.asyncForEach(jobs, async function (job) {
        await processJob(job);
    });
}

async function reprocessIncompleteSp19Jobs() {
    var jobs = await db.getUpdationJobsBetween(utils.stringToDate("2019-01-01"),
        utils.stringToDate("2019-12-31"));
    await utils.asyncForEach(jobs, async function(job) {
        await scraper_utils.reprocessIncompleteTaskIdsForCourseOfferingId(job.courseOfferingId, false);
    });
}

async function processJob(job) {
    console.log(job.dataValues);
    var params = JSON.parse(job.params);
    switch (job.sourceType) {
        case 0: await scraper_utils.download_public_echo_course(job.url, job.courseOfferingId, params);
            break;
        case 1: await scraper_utils.download_youtube_playlist(job.url, job.courseOfferingId, params);
            break;
    }
}

async function processCourseOfferingId(courseOfferingId) {
    var job = await db.getJobForCourseOfferingId(courseOfferingId);
    await processJob(job);
}

(async () => {
    if (process.argv.length < 3) {
        console.log("Insufficient arguments");
        return;
    }
    var method = process.argv[2];
    console.log(method);
    switch (method) {
        case "runSpring2019Jobs": await runSpring2019Jobs();
            break;
        case "reprocessMedias": await scraper_utils.reprocessIncompleteMedias(process.argv[3]);
            break;
        case "reprocessTasks": await scraper_utils.reprocessIncompleteTaskIdsForCourseOfferingId(process.argv[3], false);
            break;
        case "processCourseOfferingId": await processCourseOfferingId(process.argv[3]);
            break;
        case "reprocessSp19Jobs": await reprocessIncompleteSp19Jobs();
            break;
    }
})();


module.exports = {
    addJobs: addJobs,
    runSpring2019Jobs: runSpring2019Jobs,
    processCourseOfferingId: processCourseOfferingId
}
