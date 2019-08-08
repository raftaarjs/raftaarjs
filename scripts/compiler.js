

import { defaultCamelCase, componentizeName, getFileExtension, getFilenamePrefix }  from './utils/string-manipulators';
import { prepareHTML } from './processors/parse-html';
import { prepareCSS } from './processors/parse-css';
import { prepareJS } from './processors/parse-javascript';

 let config = {
  buildDir: './dist/',
  sourceDir: './src/',
};

config.componentsDir = config.sourceDir + 'components/';
config.utilsDir = config.sourceDir + 'utils/';
config.assetsDir = config.sourceDir + 'assets/';

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

let getAppObjectList = () => {
  let appObjectList = {}
  let dirStat = readDirs(config.componentsDir, 2);
  for (let entries in dirStat) {
    let cName = componentizeName(getFilenamePrefix(entries));
    appObjectList[cName] = {};
    let currentComponent = appObjectList[cName];
    if (typeof dirStat[entries] === 'object') {
      objectifyFolder(currentComponent, dirStat, entries, cName);
    } else {
      objectifyFile(currentComponent, dirStat, entries, cName);
    }
  }
  return appObjectList;
}

function commonAttrib(currentComponent, cName) {
  currentComponent.className = defaultCamelCase(cName);
  currentComponent.tagName = componentizeName(cName);
}

function objectifyFolder(currentComponent, dirStat, entries, cName) {

  currentComponent.type = 'folder';
  commonAttrib(currentComponent, cName)
  currentComponent.fileTypes = {}
  for (let entry in dirStat[entries]) {
    let { fileTypes } = currentComponent;
    fileTypes.js = fileTypes.css = fileTypes.html = [];
    if (getFileExtension(entry) === 'js') {
      fileTypes.js.push(dirStat[entries][entry]);
    }
    if (getFileExtension(entry) === 'css') {
      fileTypes.css.push(dirStat[entries][entry]);
    }
    if (getFileExtension(entry) === 'html') {
      fileTypes.html.push(dirStat[entries][entry]);
    }
  }
}

function objectifyFile(currentComponent, dirStat, entries, cName) {
  currentComponent.type = 'file';
  commonAttrib(currentComponent, cName)
  currentComponent.fileMap = dirStat[entries];
}

console.log(getAppObjectList());

function generateComponentJS(importChunk, htmlChunk, cssChunk, jsChunk) {
  let completeStructure = `
    import { LitElement, html, css } from './node_modules/lit-element/lit-element.js';

    // ${importChunk}

    class AppShell extends LitElement {

      static get styles() {
        return [
          css\`
            ${cssChunk}
          \`,
        ];
      }

      render() {
        return html\`
          ${htmlChunk}
        \`;
      }

      ${jsChunk}

    }

    customElements.define('app-shell', AppShell);
  `;
  return completeStructure;
}

// fs.mkdir('./dist');

let htmlChunk = fs.readFileSync('./sample/app-shell.html', 'utf8');
let cssChunk = fs.readFileSync('./sample/app-shell.css', 'utf8');
let jsChunk = fs.readFileSync('./sample/app-shell.js', 'utf8');

fs.writeFile("./dist/main.js", generateComponentJS('', htmlChunk, cssChunk, jsChunk), function(err) {
  if(err) {
      console.log(err);
  } else {
      console.log("The file was saved!");
  }
}); 