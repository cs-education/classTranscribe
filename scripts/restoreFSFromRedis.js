var fs = require('fs')
var mkdirp = require('mkdirp');
var client = require('../modules/redis');

//restore transcriptions
var restoreFS = function (partToRestore) {
	var keyBase = 'ClassTranscribe::' + partToRestore + '::';
	client.keys(keyBase + '*', function (err, keys) {
		if (err) {
			throw err;
		}

		keys.forEach(function(key) {
			client.smembers(key, function (err, members) {
				// there should only be one member
				if (members.length > 1) {
					console.log('more than 1')
				}

				var transcription = members[0];
				var transcriptionPath = key.slice(keyBase.length);

				var folders = transcriptionPath.split('/');
				folders.pop();
				folders = folders.join('/')
				
				mkdirp(folders, function (err) {
					if (err) {
						console.log(err);
					}
					console.log('creating ' + transcriptionPath)
					fs.writeFileSync(transcriptionPath, transcription, {mode: 0777});
				})
			});
		});
	});
}

restoreFS("Transcriptions")
restoreFS("Stats")
