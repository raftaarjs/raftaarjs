/* eslint-disable guard-for-in */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const puppeteer = require('puppeteer');
const path = require('path');

const absolutePath = path.resolve('./load.html');

function browserPageLoad(processPage) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(`file://${absolutePath}`);

      // eslint-disable-next-line no-shadow
      const pageData = await page.evaluate((processPage) => {
        function isFunction(obj) {
          const type = typeof obj;
          return type === 'function' && !!obj;
        }

        function isObject(obj) {
          const type = typeof obj;
          return type === 'object' && !!obj;
        }
        let windowPropsString = '';
        for (const prop in window) {
          windowPropsString += `${prop} `;
        }

        function iterationCopy(src, skipJunk = true, jsRaw = '') {
          const target = { constructor: {}, functions: {} };
          for (const prop in src) {
            const sortCondition = src.hasOwnProperty(prop)
            && (skipJunk || (jsRaw.indexOf(prop) > 0 && windowPropsString.indexOf(prop) < 0));

            if (sortCondition) {
              // if the value is a nested object, recursively copy all it's properties
              if (isFunction(src[prop])) {
                target.functions[prop] = src[prop].toString();
              } else if (isObject(src[prop])) {
                target.constructor[prop] = src[prop];
              } else {
                target.constructor[prop] = src[prop];
              }
            }
          }
          return target;
        }

        return window.loadScriptAsync(processPage.filePath)
          .then(() => iterationCopy(window, false, processPage.jsRaw))
          .finally(() => window.removeScript());
      }, processPage);
      await browser.close();
      return resolve(pageData);
    } catch (e) {
      return reject(e);
    }
  });
}

module.exports = { browserPageLoad };
