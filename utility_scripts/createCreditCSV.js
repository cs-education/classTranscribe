/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require('fs')
var client = require('../modules/redis');

if (process.argv.length < 4) {
  console.log('Please run as: node createCreditCSV.js <class_name> <output_fname>');
}

var className = process.argv[2];
var outputFname = process.argv[3];



// ('some_path_to_file', true)
var taskDict = {};

var firstPass = fs.readdirSync('../captions/first/CS225').map(function (member) {
  var segmentName = member.replace(".json", "").replace(".txt", "");
  taskDict[segmentName] = true;
});

var secondPass = fs.readdirSync('../captions/second/CS225').map(function (member) {
  var segmentName = member.replace(".json", "").replace(".txt", "");
  taskDict[segmentName] = true;
});

// (netID, num_tasks_completed)
var netIdScores = {};

for (task in taskDict) {
  if (!taskDict.hasOwnProperty(task)) {
    //The current property is not a direct property of taskDict
    continue;
  }
  var netID = task.split("-")[1].toLowerCase();
  if (netID === 'omelvin2' || netID === 'jren4' || netID === 'net_id' || netID === 'lol' ||
    netID === 'null' || netID === 'undefined') {
    continue;
  }

  if (netIdScores.hasOwnProperty(netID)) {
    netIdScores[netID] = netIdScores[netID] + 1;
  } else {
    netIdScores[netID] = 1;
  }
}

var csvString = [];

for (netID in netIdScores) {
  csvString.push(netID + ', ' + netIdScores[netID] + '\n');
}

fs.writeFileSync(outputFname, csvString.join(''));

console.log('finished');

process.exit(0);


