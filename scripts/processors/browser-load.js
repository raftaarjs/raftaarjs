const puppeteer = require('puppeteer');
const fs = require('fs');
var path = require("path");

var absolutePath = path.resolve("./load.html");

function browserPageLoad(processPage) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('file://' + absolutePath);

      const pageData = await page.evaluate((processPage) => {
        function isFunction(obj) {
          var type = typeof obj;
          return type === 'function' && !!obj;
        }

        function isObject(obj) {
          var type = typeof obj;
          return type === 'object' && !!obj;
        }
        let windowPropsString = ''
        for (let prop in window) {
          windowPropsString += prop + ' ';
        }

        function iterationCopy(src, skipJunk = true, jsRaw = '') {
          let target = { constructor: {}, functions: {} };
          for (let prop in src) {
            if (src.hasOwnProperty(prop) && (skipJunk || (jsRaw.indexOf(prop) > 0 && windowPropsString.indexOf(prop) < 0))) {
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

        let outputObj = []
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