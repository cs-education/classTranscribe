/*
    /captions
 */



router.get('/captions/:className/:index', function (request, response) {
  var className = request.params.className.toLowerCase();
  var captions = captionsMapping[className];

  response.writeHead(200, {
    'Content-Type': 'application/json'
  });

  var index = parseInt(request.params.index);
  response.end(JSON.stringify({ captions: captions[index] }));
});

module.exports = router;
