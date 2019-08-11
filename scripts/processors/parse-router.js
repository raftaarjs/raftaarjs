let { readFile } = require('../utils/readers');

function prepareRouter(filePath) {
  let routerRaw = readFile(filePath);
  return Promise.resolve(JSON.parse(routerRaw));
}

module.exports = { prepareRouter };