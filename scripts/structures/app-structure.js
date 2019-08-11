let { defaultPascalCase, componentizeName, getFileExtension, getFilenamePrefix } = require('../utils/string-manipulators');

let { readDirs } = require('./directory-structure');

function getAppObjectList(config) {
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
    currentComponent.className = defaultPascalCase(cName);
    currentComponent.tagName = componentizeName(cName);
  }
  
  function objectifyFolder(currentComponent, dirStat, entries, cName) {
  
    currentComponent.type = 'folder';
    commonAttrib(currentComponent, cName)
    currentComponent.fileTypes = { html:[], css:[], js:[] };
    for (let entry in dirStat[entries]) {
      let { fileTypes } = currentComponent;
      if (getFileExtension(entry) === 'js') {
        fileTypes.js.push(dirStat[entries][entry]);
      } else if (getFileExtension(entry) === 'css') {
        fileTypes.css.push(dirStat[entries][entry]);
      } else if (getFileExtension(entry) === 'html') {
        fileTypes.html.push(dirStat[entries][entry]);
      }
    }
  }
  
  function objectifyFile(currentComponent, dirStat, entries, cName) {
    currentComponent.type = 'file';
    commonAttrib(currentComponent, cName)
    currentComponent.fileMap = dirStat[entries];
  }
  
  module.exports = { getAppObjectList };