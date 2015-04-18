var reverseIndex = Object.create(null);

function createReverseIndex() {
  videoCaptions.forEach(function (captions, i) {
    var currentTime = 0;
    var prevWord = "";
    var prevprevWord = "";
    captions.forEach(function (caption) {
      caption.text.split(/\s+/).forEach(function (word) {
        word = word.replace(/[\W_]+/g,"").toLowerCase(); // Remove all non-alphanumeric characters
        if (word) {
          reverseIndex[word] = (reverseIndex[word] || []);
          reverseIndex[word].push({
            videoIndex: i,
            startTime: currentTime,
            snippet: caption.text
          });
          if (prevWord.length) {
            reverseIndex[prevWord + " " + word] = (reverseIndex[prevWord + " " + word] || []);
            reverseIndex[prevWord + " " + word].push({
              videoIndex: i,
              startTime: currentTime,
              snippet: caption.text
            });
            if (prevprevWord.length) {
              reverseIndex[prevprevWord + " " + prevWord + " " + word] = (reverseIndex[prevprevWord + " " + prevWord + " " + word] || []);
              reverseIndex[prevprevWord + " " + prevWord + " " + word].push({
                videoIndex: i,
                startTime: currentTime,
                snippet: caption.text
              });
            }
            prevprevWord = prevWord;
          }
          prevWord = word;
        }
      });
      prevWord = "";
      currentTime += (caption.width / 64) + (2/64);
    });
  });
}

a = new Date();
createReverseIndex();
console.log (new Date() - a);

$(document).ready(function () {
  bindEventListeners();
  $(".search-box").focus();
});

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  var debouncedInputKeypress = debounce(inputKeypress, 200);
  $(".search-box").off().keyup(debouncedInputKeypress);
  $(".search-box").keyup(); // Trigger event to account for auto fill
}

/*
  Helper debounce function
*/
function debounce (func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/*
  Send a search event to GA
*/
function sendGAEvent() {
  var searchQuery = $(".search-box").val();
  if (searchQuery.length) {
    ga('send', 'event', 'homepage', 'search', searchQuery);
  }
}

var debouncedSendGAEvent = debounce(sendGAEvent, 1000);

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  debouncedSendGAEvent();
  $(".search-results-container").empty();
  var query = $(".search-box").val().toLowerCase();

  query = query.trim().replace(/[^a-zA-Z\d\s:]+/g,""); // Remove all non-alphanumeric characters
  var results = Object.create(null);
  if (reverseIndex[query]) {
    reverseIndex[query].forEach(function (match) {
      if (!results[match.snippet]) {
        var snippet = match.snippet.toLowerCase();
        var query = $(".search-box").val().toLowerCase();
        query.trim().split(/\s+/).forEach(function (word) {
          snippet = updateHaystack(snippet, word);
        });
        var template = '<div><a href="/viewer.html?videoIndex=' + match.videoIndex + '&startTime=' + match.startTime + '">' + snippet + '</a></div>';
        $(".search-results-container").append(template);
        results[match.snippet] = true;
      }
    });
  }

  query = query.trim().split(/\s+/);

  var subStrings = [];
  for (var i = 0; i < query.length; i++) {
    for (var j = i; j < query.length; j++) {
      subStrings.push(query.slice(i, j+1).join(" "));
    }
  }

  subStrings = subStrings.sort(function (a,b) {
    return b.length - a.length;
  });

  subStrings.forEach(function (subString) {
    var query = subString;
    if (reverseIndex[query]) {
      reverseIndex[query].forEach(function (match) {
        if (!results[match.snippet]) {
          var snippet = match.snippet.toLowerCase();
          var query = $(".search-box").val().toLowerCase();
          query.trim().split(/\s+/).forEach(function (word) {
            snippet = updateHaystack(snippet, word);
          });
          var template = '<div><a href="/viewer.html?videoIndex=' + match.videoIndex + '&startTime=' + match.startTime + '">' + snippet + '</a></div>';
          $(".search-results-container").append(template);
          results[match.snippet] = true;
        }
      });
    }
  });
}

/*
  Bolds a needle in the input
*/
function updateHaystack(input, needle) {
  return input.replace(new RegExp('(^|[^a-zA-Z\d\s:])(' + escapeRegExp(needle) + ')([^a-zA-Z\d\s:]|$)','ig'), '$1<b>$2</b>$3');
}

/*
  Escapes a regular expression string
*/
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}