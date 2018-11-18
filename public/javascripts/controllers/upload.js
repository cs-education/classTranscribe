/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
window.addEventListener("load", Ready);

$(document).ready(Ready)

function Ready() {
  if (window.File && window.FileReader) { //These are the necessary HTML5 objects the we are going to use
    document.getElementById('UploadButton').addEventListener('click', StartUpload);
    document.getElementById('FileBox').addEventListener('change', FileChosen);
  } else {
    document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
  }
}
var SelectedFile;

function FileChosen(evnt) {
  SelectedFile = evnt.target.files[0];
//  document.getElementById('FileBox').value = SelectedFile.name;
}

var socket = io.connect('http://classtranscribe.com:8080');
var FReader;
var Name;

function StartUpload() {
  var fileName = document.getElementById('FileBox').value
  if (fileName != "") {
    if (true || fileName.toLowerCase().indexOf(".mp4") > 0) {
      FReader = new FileReader();
      Name = document.getElementById('FileBox').value;
      var Content = '<div id="ProgressContainer"><div id="ProgressBar"></div><span id="percent">0%</span>';
      Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span></div>";
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function(evnt) {
        socket.emit('Upload', {
          'Name': Name,
          Data: evnt.target.result
        });
      }
      socket.emit('Start', {
        'Name': Name,
        'Size': SelectedFile.size
      });
    } else {
      alert("Please Upload An MP4 File");
    }
  } else {
    alert("Please Select A File");
  }
}

socket.on('MoreData', function(data) {
  UpdateBar(data['Percent']);
  var Place = data['Place'] * 524288; //The Next Blocks Starting Position
  var NewFile; //The Variable that will hold the new Block of Data
  if (SelectedFile.webkitSlice) {
    NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size - Place)));
  } else if (SelectedFile.mozSlice) {
    NewFile = SelectedFile.mozSlice(Place, Place + Math.min(524288, (SelectedFile.size - Place)));
  } else {
    NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size - Place)));
  }
  FReader.readAsBinaryString(NewFile);
});

function UpdateBar(percent) {
  document.getElementById('ProgressBar').style.width = percent + '%';
  document.getElementById('percent').innerHTML = (Math.round(percent * 100) / 100) + '%';
  var MBDone = Math.round(((percent / 100.0) * SelectedFile.size) / 1048576);
  document.getElementById('MB').innerHTML = MBDone;
}

socket.on('Done', function (data) {
  window.location = "/first/upload/user?videoPath=" + data['Video']
});

function Refresh() {
  location.reload(true);
}
