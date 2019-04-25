/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var router = express.Router();
const db = require('../db/db');

router.post('/log',async function (req, res) {

    if (typeof req.user.id !== 'undefined') {
        userId = req.user.id;
        mailId = req.user.mailId;
    } else {
        userId = 'NotLoggedIn';
        mailId = 'NotLoggedIn';
    }
    
    json = req.body;
    json.mailId = mailId;
    await db.addLogs(userId, json.courseOfferingId, json.action, json.item, json.time, JSON.stringify(json));
    res.json({ success: true });
});

module.exports = router;
