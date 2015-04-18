var reverseIndex = Object.create(null);

function createReverseIndex() {
  videoCaptions.forEach(function (captions, i) {
    var currentTime = 0;
    var prevWord = "";
    var prevprevWord = "";
    captions.forEach(function (caption) {
      caption.text.split(/\s+/).forEach(function (word) {
        word = word.replace(/[.,!"]/g,"").toLowerCase();
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
  var debouncedSendGAEvent = debounce(sendGAEvent, 1000);
  $(".search-box").off().keyup(debouncedInputKeypress)
                        .keyup(debouncedSendGAEvent);
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
  Helper throttle function
*/
function throttle (cb, limit) {
  var wait = false;
  return function () {
    if (!wait) {
      cb.call();
      wait = true;
      setTimeout(function () {
        wait = false;
      }, limit);
    }
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

/*
  Generate all combinations of a words array
*/
function getCombinations(words) {
  var result = [];
  var f = function(prefix, words) {
    for (var i = 0; i < words.length; i++) {
      result.push(prefix.concat(words[i]));
      f(prefix.concat(words[i]), words.slice(i + 1));
    }
  };
  f([], words);
  return result;
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  $(".search-results-container").empty();
  var results = Object.create(null);
  var query = $(".search-box").val().toLowerCase();
  query = query.trim().replace(/[.,!"]/g,"").split(/\s+/);

  var subQueries = getCombinations(query);

  subQueries = subQueries.sort(function (a,b) {
    return b.length - a.length;
  });

  subQueries.forEach(function (subQuery) {
    var query = subQuery;
    var firstQueryResults = reverseIndex[query[0]] || [];
    firstQueryResults = firstQueryResults.filter(function (result) {
      var valid = true;
      query.slice(1).forEach(function (word) {
        var containsWord = false;
        result.snippet.split(/\s+/).forEach(function (snippetWord) {
          if (snippetWord === word) {
            containsWord = true;
          }
        });
        valid = containsWord;
      });
      return valid;
    });

    firstQueryResults.forEach(function (match) {
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