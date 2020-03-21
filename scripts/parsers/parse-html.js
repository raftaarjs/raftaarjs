const { readFile } = require('../utils/readers');

function prepareHTML(filePath) {
  const htmlRaw = readFile(filePath);
  return Promise.resolve(htmlRaw);
}

module.exports = { prepareHTML };
