var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs'),
  exec = require('child_process').exec,
  util = require('util'),
  Files = {};

var uploadIndex = 0;

app.listen(8080);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
}

io.sockets.on('connection', function(socket) {
  socket.on('Start', function(data) { //data contains the variables that we passed through in the html file
    var Name = data['Name'];
    Files[Name] = { //Create a new Entry in The Files Variable
      FileSize: data['Size'],
      Data: "",
      Downloaded: 0
    }
    var Place = 0;
    try {
      var Stat = fs.statSync('Temp/' + Name);
      if (Stat.isFile()) {
        Files[Name]['Downloaded'] = Stat.size;
        Place = Stat.size / 524288;
      }
    } catch (er) {} //It's a New File
    fs.open("Temp/" + Name, 'a', 0755, function(err, fd) {
      if (err) {
        console.log(err);
      } else {
        Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
        socket.emit('MoreData', {
          'Place': Place,
          Percent: 0
        });
      }
    });
  });

  socket.on('Upload', function(data) {
    var Name = data['Name'];
    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];
    console.log(Files[Name]['Downloaded'], Files[Name]['FileSize'])
    if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
    {
      fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen) {
        var newName = (++uploadIndex) + ".webm";
        var inp = fs.createReadStream("Temp/" + Name);
        var out = fs.createWriteStream("Video/" + newName);
        util.pump(inp, out, function() {
          fs.unlink("Temp/" + Name, function() { //This Deletes The Temporary File
            exec("ffmpeg -i Video/" + newName + " -q:v 9 -c:v libvpx -c:a libvorbis" + newName, function () {
              console.log(err);
              exec("ffmpeg -i Video/" + newName + " -codec:a libmp3lame -qscale:a 2 Video/" + newName.replace("webm", "mp3"), function (err){
                console.log(err)
                socket.emit('Done', {
                  'Video': '/Video/' + newName
                });
              });
            });
          });
        });
      });
    } else if (Files[Name]['Data'].length > 10485760) { //If the Data Buffer reaches 10MB
      fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen) {
        Files[Name]['Data'] = ""; //Reset The Buffer
        var Place = Files[Name]['Downloaded'] / 524288;
        var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
        socket.emit('MoreData', {
          'Place': Place,
          'Percent': Percent
        });
      });
    } else {
      var Place = Files[Name]['Downloaded'] / 524288;
      var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
      socket.emit('MoreData', {
        'Place': Place,
        'Percent': Percent
      });
    }
  });
});