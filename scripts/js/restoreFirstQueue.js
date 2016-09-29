var fs = require('fs')
var client = require('../modules/redis');

var restoreRedis = function(fileType, className) {
  var lecs = fs.readdirSync('../' + fileType + '/first/' + className);
  

  lecs.forEach(function (file) {
    client.sadd("ClassTranscribe::First::CHEM233-SP16", file);
  });

  console.log('finished');
}



restoreRedis('captions', 'CHEM233-SP16');