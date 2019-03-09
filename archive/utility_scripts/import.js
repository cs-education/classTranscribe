/** Copyright 2015 Board of Trustees of University of Illinois
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var fs = require("fs");

require("glob").glob("../captions/first/*.json", function (er, files) {
  console.log (files)
  files.forEach(function (filename) {
    var file = fs.readFileSync(filename).toString();
    console.log("// Part " + filename.split("Part_")[1].split("-")[0]);
    console.log(file + ",");
  });
});

require("glob").glob("../captions/second/*.json", function (er, files) {
  console.log (files)
  files.forEach(function (filename) {
    var file = fs.readFileSync(filename).toString();
    console.log("// Part " + filename.split("Part_")[1].split("-")[0]);
    console.log(file + ",");
  });
});