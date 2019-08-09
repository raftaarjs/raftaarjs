const fs = require('fs');
var path = require('path');

function readDirs(pathName, depth) {
  function readRecursive(pathsObject, pathName, depthCount) {
    if (depthCount == 0)
      return pathsObject;
    var files = fs.readdirSync(pathName);
    for (var fileIndex in files) {
      var file = files[fileIndex];
      var currentPath = path.join(pathName, file);
      pathsObject[file] = currentPath;
      if (fs.lstatSync(currentPath).isDirectory()) {
        readRecursive(pathsObject[file] = {}, currentPath, depthCount - 1);
      }
    }
    return pathsObject;
  }
  return readRecursive({}, pathName, depth);
}

module.exports = { readDirs };