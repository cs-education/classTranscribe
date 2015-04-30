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
    console.log("// Part " + filename.split("Part_").split("-")[0]);
    console.log(file + ",");
  });
});