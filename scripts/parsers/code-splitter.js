var cheerio = require('cheerio');
const path = require('path');
let { readFile } = require('../utils/readers');
let { writeTempFile, createDir } = require('../utils/writers');

function prepareCodeSplit(filePath, tagName, componentsDir) {
  return new Promise(async (resolve, reject) => {
    let codeRaw = readFile(filePath);
    let code = cheerio.load(codeRaw);

    const htmlCode = getHTMLCode(code);
    const jsCode = getJSCode(code);
    const cssCode = getCSSCode(code);
    const basePath = path.join(componentsDir, tagName);

    const htmlFilePath = path.join(basePath, tagName + '.html');
    const cssFilePath = path.join(basePath, tagName + '.css');
    const jsFilePath = path.join(basePath, tagName + '.js');

    const htmlTemp = await writeTempFile(htmlFilePath, htmlCode);
    const cssTemp = await writeTempFile(cssFilePath, cssCode);
    const jsTemp = await writeTempFile(jsFilePath, jsCode);

    let fileTypes = {
      html: [htmlTemp],
      css: [cssTemp],
      js: [jsTemp],
    };

    return resolve(fileTypes);
  });
}

function getHTMLCode(code) {
  let htmlCode = code('body').clone().find("script,noscript,style").remove().end().html();
  return htmlCode.replace(/=&gt;/g, '=>')
}

function getJSCode(code) {
  let allScripts = ``;
  code('script').get().forEach(aScript => {
    allScripts += aScript.children[0].data + '\n';
  });
  return allScripts;
}

function getCSSCode(code) {
  let allStyles = ``;
  code('style').get().forEach(aStyle => {
    allStyles += aStyle.children[0].data + '\n';
  });
  return allStyles;
}

module.exports = { prepareCodeSplit };