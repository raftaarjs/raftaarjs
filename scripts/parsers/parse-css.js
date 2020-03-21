const { readFile } = require('../utils/readers');

function prepareCSS(filePath) {
  const cssRaw = readFile(filePath);
  return Promise.resolve(cssRaw);
}

module.exports = { prepareCSS };
