/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const path = require('path');

const { getAppObjectList } = require('../structures/app-structure');
const { prepareHTML } = require('../parsers/parse-html');
const { prepareCSS } = require('../parsers/parse-css');
const { prepareJS } = require('../parsers/parse-javascript');
const { prepareRouter } = require('../parsers/parse-router');
const { prepareComponent } = require('../parsers/parse-component');
const { prepareCodeSplit } = require('../parsers/code-splitter');
const { processRouter } = require('./build-vaadin-router');
const { getFileExtension } = require('../utils/string-manipulators');
const { writeComponent, copyAssets, copyJSFiles } = require('../utils/writers');
const {
  processHTML, processCSS, processJS, buildShell,
} = require('./build-lit');

function collectHTML(filePath) {
  return prepareHTML(filePath)
    .then((parsedHTML) => processHTML(parsedHTML));
}

function collectCSS(filePath) {
  return prepareCSS(filePath)
    .then((parsedCSS) => processCSS(parsedCSS));
}

function collectJS(filePath) {
  return prepareJS(filePath)
    .then((parsedJS) => processJS(parsedJS));
}

function collectRouter(filePath) {
  return prepareRouter(filePath)
    .then((parsedRouter) => processRouter(parsedRouter));
}

function collectResource(fileTypes) {
  return new Promise((resolve, reject) => {
    let htmlChunk = '';
    let cssChunk = '';
    let jsChunk = '';
    let importChunk = '';

    const htmlPromise = fileTypes.html[0] ? collectHTML(fileTypes.html[0]).then((chunk) => { htmlChunk = chunk; }) : '';
    const cssPromise = fileTypes.css[0] ? collectCSS(fileTypes.css[0]).then((chunk) => { cssChunk = chunk; }) : '';
    const jsPromise = fileTypes.js[0] ? collectJS(fileTypes.js[0]).then((chunk) => { jsChunk = chunk.jsChunk; importChunk = chunk.importChunk; }) : '';

    Promise.all([htmlPromise, cssPromise, jsPromise])
      .then(() => resolve({
        htmlChunk, cssChunk, jsChunk, importChunk,
      }))
      .catch((e) => reject(e));
  });
}

function compileFolderComponents(appObject, filePath) {
  const { className, tagName } = appObject;

  collectResource(appObject.fileTypes)
    .then((chunks) => prepareComponent(Object.assign(chunks,
      {
        componentAttribs: { className, tagName },
      })))
    .then((component) => writeComponent(filePath, component));
}

function compileHTMLFileComponent(appObject, filePath, componentsDir) {
  const { className, tagName, fileMap: srcFilePath } = appObject;

  prepareCodeSplit(srcFilePath, tagName, componentsDir)
    .then((fileTypes) => collectResource(fileTypes))
    .then((chunks) => prepareComponent(Object.assign(chunks,
      {
        componentAttribs: { className, tagName },
      })))
    .then((component) => writeComponent(filePath, component));
}

function compileJSFileComponent(source) {
  copyJSFiles(source);
}

function compileComponents(config) {
  const appObjectList = getAppObjectList(config);

  for (const appObjectKey in appObjectList) {
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

function compileShell(config) {
  const routerFile = path.join(config.sourceDir, 'router.json');
  const shellPath = path.join(config.buildDir, 'app-shell.js');

  collectRouter(routerFile)
    .then((router) => buildShell(router))
    .then((component) => writeComponent(shellPath, component));
}

function startBuild(config) {
  copyAssets(config);
  compileComponents(config);
  compileShell(config);
}

module.exports = { startBuild, compileFolderComponents };
