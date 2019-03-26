var window;
var courseOfferingId;
var url;

function setWindow(win) {
    window = win
    url = window.document.URL        ;
    courseOfferingId = url.substring(url.lastIndexOf('/') + 1);
}

function log(action, item, json) {
    json.time = new Date().toISOString();
    json.courseOfferingId = courseOfferingId;
    json.action = action;
    json.item = item;
    console.log(json);
    $.post( "/log", json );

}

class VideoLogger {
    constructor(window, videojs) {
        this.videojs = videojs
        this.timestamp = 0        
        setWindow(window)
    }

    getJson() {
        var json = {};        
        json.src = this.videojs.currentSrc();
        json.type = this.videojs.currentType();
        json.timestamp = this.videojs.currentTime();
        return json;
    }

    changeVideo() {
        var json = this.getJson();
        log("changevideo", json.src, json);
    }
    pausevideo() {        
        var json = this.getJson();
        log("pause", json.src, json);
    }
    
    userinactive() {
        var json = this.getJson();
        log("userinactive", json.src, json);
    }
    
    testtrackchange() {
        var json = this.getJson();
        log("testtrackchange", json.src, json);
    }
    
    fullscreenchange() {
        var json = this.getJson();
        log("fullscreenchange", json.src, json);
    }
    
    timeupdate() {
        if (Math.abs(this.videojs.currentTime()-this.timestamp) > 15) {
            var json = this.getJson();
            this.timestamp = this.videojs.currentTime()
            log("timeupdate", json.src, json);
        }
    }    

    playvideo() {
        var json = this.getJson();
        log("play", json.src, json);
    }

    changedspeed() {    
        var json = this.getJson();
        log("changedspeed", json.src, json);
    }

    seeking() {
        var json = this.getJson();
        log("seeking", json.src, json);
    }

    seeked() {
        var json = this.getJson();
        log("seeked", json.src, json);
    }
}

class TranscriptionLogger {

    constructor(window, videojs) {
        this.videojs = videojs;
        setWindow(window);
    }

    getJson() {
        var json = {};        
        json.src = this.videojs.currentSrc();
        json.type = this.videojs.currentType();
        json.timestamp = this.videojs.currentTime();
        return json;
    }

    edittrans(original, edited) {
        var json = this.getJson();
        json.original = original;
        json.edited = edited;
        log("edittrans", json.src, json);
    }

    filtertrans(keyword) {
        var json = this.getJson();
        json.keyword = keyword;
        log("filtertrans", json.src, json);
    }

    sharelink(link) {
        var json = this.getJson();
        json.link = link;
        log("sharelink", json.src, json);
    }
}

class MiscEventLogger {

    constructor(window) {
        setWindow(window);
    }

    getJson() {
        var json = {};        
        return json;
    }

    login() {
        var json = this.getJson();
        log("login", "googleauth", json)
    }

    selectcourse(courseOfferingId) {
        var json = this.getJson();
        log("selectcourse", courseOfferingId, json);
    }
}

var logger = {
    VideoLogger: VideoLogger,
    TranscriptionLogger: TranscriptionLogger,
    MiscEventLogger: MiscEventLogger
}