const { readFile } = require('../utils/readers');

function prepareRouter(filePath) {
  const routerRaw = readFile(filePath);
  return Promise.resolve(JSON.parse(routerRaw));
}

module.exports = { prepareRouter };
