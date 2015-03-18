var reverseIndex = {};

function createReverseIndex() {
  videoCaptions.forEach(function (captions, i) {
    var currentTime = 0;
    var prevWord = "";
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
          }
          prevWord = word;
        }
      })
      prevWord = "";
      currentTime += (caption.width / 64) + (2/64);
    })
  })
}

createReverseIndex();

$(document).ready(function () {
  bindEventListeners();
});

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".search-box").off().keyup(inputKeypress);
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  $(".search-results-container").empty()
  var query = $(".search-box").val().toLowerCase();
  var re = new RegExp("(^|\s)(" + query + ")(\s|$)","g");
  query = query.replace(/[^a-zA-Z\d\s:]+/g,""); // Remove all non-alphanumeric characters
  if (reverseIndex[query]) {
    console.log()
    reverseIndex[query].forEach(function (match) {
      var snippet = match.snippet;
      query.split(/\s+/).forEach(function (word) {
        snippet = updateHaystack(snippet, word);
      });
      var template = '<div><a href="/viewer.html?videoIndex=' + match.videoIndex + '&startTime=' + match.startTime + '">' + snippet + '</a></div>';
      console.log(template)
      $(".search-results-container").append(template);
    });
  }
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