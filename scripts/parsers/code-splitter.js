const cheerio = require('cheerio');
const path = require('path');
const { readFile } = require('../utils/readers');
const { writeTempFile } = require('../utils/writers');

function getHTMLCode(code) {
  const htmlCode = code('body')
    .clone()
    .find('script,noscript,style')
    .remove()
    .end()
    .html();

  return htmlCode.replace(/=&gt;/g, '=>');
}

function getJSCode(code) {
  let allScripts = '';
  code('script').get().forEach((aScript) => {
    allScripts += `${aScript.children[0].data}
    `;
  });
  return allScripts;
}

function getCSSCode(code) {
  let allStyles = '';
  code('style').get().forEach((aStyle) => {
    allStyles += `${aStyle.children[0].data}
    `;
  });
  return allStyles;
}

async function prepareCodeSplit(filePath, tagName, componentsDir) {
  const codeRaw = readFile(filePath);
  const code = cheerio.load(codeRaw);

  const htmlCode = getHTMLCode(code);
  const jsCode = getJSCode(code);
  const cssCode = getCSSCode(code);
  const basePath = path.join(componentsDir, tagName);

  const htmlFilePath = path.join(basePath, `${tagName}.html`);
  const cssFilePath = path.join(basePath, `${tagName}.css`);
  const jsFilePath = path.join(basePath, `${tagName}.js`);

  const htmlTemp = await writeTempFile(htmlFilePath, htmlCode);
  const cssTemp = await writeTempFile(cssFilePath, cssCode);
  const jsTemp = await writeTempFile(jsFilePath, jsCode);

  const fileTypes = {
    html: [htmlTemp],
    css: [cssTemp],
    js: [jsTemp],
  };

  return fileTypes;
}

module.exports = { prepareCodeSplit };
