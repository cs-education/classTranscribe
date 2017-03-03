var homeMustache = fs.readFileSync(mustachePath + 'home.mustache').toString();
router.get('/', function (request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/html'
  });

  renderWithPartial(homeMustache, request, response);
  /*
    var header = getHeader(req);
  
  
    var html = Mustache.render(homeMustache, {
      list: header['list']
    }, {
        partial: header['partial']
      });
    response.end(html);
  */
});

module.exports = router;