let path = require("path");

let { getAppObjectList } = require('../structures/app-structure');
let { prepareHTML } = require('../parsers/parse-html');
let { prepareCSS } = require('../parsers/parse-css');
let { prepareJS } = require('../parsers/parse-javascript');
let { prepareRouter } = require('../parsers/parse-router');
let { prepareComponent } = require('../parsers/parse-component');
let { prepareCodeSplit } = require('../parsers/code-splitter');
let { processHTML, processCSS, processJS, buildShell } = require('./build-lit');
let { processRouter } = require('./build-vaadin-router');
let { getFileExtension } = require('../utils/string-manipulators');
let { writeComponent, copyAssets, copyJSFiles } = require('../utils/writers');

function startBuild(config) {
  copyAssets(config);

  compileComponents(config);

  compileShell(config);
}

function compileComponents(config) {
  let appObjectList = getAppObjectList(config);

  for (appObjectKey in appObjectList) {
    const appObject = appObjectList[appObjectKey];
    const filePath = path.join(config.buildComponentsDir, `${appObject.tagName}.js`);

    if (appObject.type === 'folder') {
      compileFolderComponents(appObject, filePath);
    } else if (appObject.type === 'file' && (getFileExtension(appObject.fileMap) === 'js' || getFileExtension(appObject.fileMap) === 'mjs')) {
      compileJSFileComponent(appObject.fileMap, config);
    } else if (appObject.type === 'file' && (getFileExtension(appObject.fileMap) === 'html' || getFileExtension(appObject.fileMap) === 'htm')) {
      compileHTMLFileComponent(appObject, filePath, config.componentsDir);
    }
  }
}

function compileFolderComponents(appObject, filePath) {
  const { className, tagName } = appObject;

  collectResource(appObject.fileTypes)
    .then(chunks => prepareComponent(Object.assign(chunks, { componentAttribs: { className, tagName } })))
    .then(component => writeComponent(filePath, component));
}

function compileHTMLFileComponent(appObject, filePath, componentsDir) {
  let { className, tagName, fileMap: srcFilePath } = appObject;

  prepareCodeSplit(srcFilePath, tagName, componentsDir)
    .then((fileTypes) => collectResource(fileTypes))
    .then(chunks => prepareComponent(Object.assign(chunks, { componentAttribs: { className, tagName } })))
    .then(component => writeComponent(filePath, component));
}

function compileJSFileComponent(source) {
  copyJSFiles(source);
}

function compileShell(config) {
  let routerFile = path.join(config.sourceDir, 'router.json');
  let shellPath = path.join(config.buildDir, 'app-shell.js');
  collectRouter(routerFile)
    .then(router => buildShell(router))
    .then(component => writeComponent(shellPath, component));
}

function collectResource(fileTypes) {
  return new Promise((resolve, reject) => {
    let htmlChunk = '', cssChunk = '', jsChunk = '', importChunk = '';
    let htmlPromise = fileTypes.html[0] ? collectHTML(fileTypes.html[0]).then(chunk => htmlChunk = chunk) : '';
    let cssPromise = fileTypes.css[0] ? collectCSS(fileTypes.css[0]).then(chunk => cssChunk = chunk) : '';
    let jsPromise = fileTypes.js[0] ? collectJS(fileTypes.js[0]).then(chunk => { jsChunk = chunk.jsChunk; importChunk = chunk.importChunk }) : '';

    Promise.all([htmlPromise, cssPromise, jsPromise])
      .then(() => resolve({ htmlChunk, cssChunk, jsChunk, importChunk }))
      .catch((e) => reject(e));
  });
}

function collectHTML(filePath) {
  return prepareHTML(filePath)
    .then(parsedHTML => processHTML(parsedHTML));
}

function collectCSS(filePath) {
  return prepareCSS(filePath)
    .then(parsedCSS => processCSS(parsedCSS));
}

function collectJS(filePath) {
  return prepareJS(filePath)
    .then(parsedJS => processJS(parsedJS));
}

function collectRouter(filePath) {
  return prepareRouter(filePath)
    .then(parsedRouter => processRouter(parsedRouter));
}

module.exports = { startBuild, compileFolderComponents };