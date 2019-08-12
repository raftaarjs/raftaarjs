let { readFile } = require('../utils/readers');

function prepareHTML(filePath) {
  let htmlRaw = readFile(filePath);
  return Promise.resolve(htmlRaw);
}

module.exports = { prepareHTML };