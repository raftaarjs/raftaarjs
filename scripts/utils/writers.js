const fs = require('fs');
const path = require('path');
var ncp = require('ncp').ncp;

const { readFile } = require('./readers');

function writeComponent(filePath, component, log = true) {
  fs.writeFile(filePath, component, function (err) {
    if (err) {
      console.log(err);
    } else {
      if (log) console.log(`Component ${filePath} written`);
    }
  });
}

function copyAssets(config) {
  const source = config.sourceDir;
  const destination = config.buildDir
  const componentsDir = config.buildComponentsDir;
  ncp.limit = 16;

  copyRootFiles('index.html', source, destination);
  // copyRootFiles('app-shell.js', source, destination);
  copyRootFiles('service-worker.js', source, destination);
  copyRootFiles('manifest.json', source, destination);
  copyRootFiles('favicon.ico', source, destination);
  copyRootFiles('assets/', source, destination);

  try {
    createDir(destination);
    createDir(componentsDir);
    createDir('./.temp');
    createDir('./.temp/components');
  } catch (err) {
    console.error(err)
  }
}

function copyRootFiles(filename, source, destination, log = true) {
  let src = path.join(source, filename);
  let dist = path.join(destination, filename);

  ncp(src, dist, (err) => {
    if (err) throw err;
    if (log) console.log('Copied ' + filename);
  });
}


function copyJSFiles(src, prefix = 'src', log = true) {
  let dist = src.replace(prefix, 'dist');;

  ncp(src, dist, (err) => {
    if (err) throw err;
    if (log) console.log('Copied ' + src);
  });
}

function writeTempFile(filePath, rawText, prefix = 'src') {
  let tempFilePath = filePath.replace(prefix, '.temp');
  let tempFileDir = path.dirname(tempFilePath);
  return new Promise(resolve => {
    if (!fs.existsSync(tempFileDir)) {
      fs.mkdirSync(tempFileDir, { recursive: true }, (err) => {
        if (err) throw err;
        fs.writeFile(tempFilePath, rawText, function (err) {
          if (err) console.log(err);
          return resolve(tempFilePath);
        });
      });
    }

    fs.writeFile(tempFilePath, rawText, function (err) {
      if (err) console.log(err);
      return resolve(tempFilePath);
    });

  });
}

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

module.exports = { writeComponent, createDir, copyAssets, writeTempFile, copyJSFiles };