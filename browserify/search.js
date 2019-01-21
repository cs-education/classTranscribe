var lunr = require('lunr')
var jslinq = require('jslinq')

function getLunrObj(allSubs) {
    var idx = lunr(function () {
        this.ref('id')
        this.field('part')

        allSubs.forEach(function (doc) {
            this.add(doc)
        }, this)
    }); 
    return idx;
}

window.getLunrObj = getLunrObj;
function getjslinq(allSubs) {
    return jslinq(allSubs);
}

window.jslinq = getjslinq;

module.exports = {
    getLunrObj: getLunrObj
}
