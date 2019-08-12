let { readFile } = require('../utils/readers');

function prepareCSS(filePath) {
  let cssRaw = readFile(filePath);
  return Promise.resolve(cssRaw);
}

module.exports = { prepareCSS };