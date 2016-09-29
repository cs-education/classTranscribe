var fs = require('fs')

var client = require('../modules/redis');


// get all keys from redis
// get all files in captions/first/ 
// remove redis keys from files
// create keys with remaining file names

var restoreRedis = function(fileType, className) {
  var lecs = fs.readdirSync('../' + fileType + '/first/' + className).map(function (filename) {
    return 'ClassTranscribe::Transcriptions::' + fileType + '/first/' +
      className + '/' + filename.split('/').pop();
  });

  lecs.forEach(function (file) {
    var filename = file.split('::').pop();
    try {
      var contents = fs.readFileSync('../' + filename).toString();

      // console.log(filename);
      client.sadd(file, contents);
    } catch (ex) {
      console.log(ex);
    }
    

  });

  console.log('finished');

  // client.keys('*' + fileType + '*', function (err, keys) {
  //   if (err) {
  //     throw err;
  //   }

  //   var redisKeys = {}
  //   keys.forEach(function (key) {
  //     redisKeys[key] = true;
  //   });

    

  //   var lectures = new Set(
  //     lecs
  //   )
  //   console.log('hi')

  //   console.log(redisSet.isSubset(keys))

  //   var filesToBackup = redisSet.difference(keys);

  //   filesToBackup.forEach(function (file) {
  //     var filename = file.split('::').pop();
  //     var contents = fs.readFileSync(filename).toString();

  //     console.log(filename)
  //     // client.sadd(file, contents);
  //   });
  // });
}

restoreRedis('captions', 'CS225');
restoreRedis('stats', 'CS225');

