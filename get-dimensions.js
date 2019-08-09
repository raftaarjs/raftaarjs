const puppeteer = require('puppeteer');
var path = require("path");
var absolutePath = path.resolve("./load.html");
const fs = require('fs');
const jsChunk = fs.readFileSync(process.argv[2] || './sample/app-shell.js', 'utf8');



function browserPageLoad() {
  let processPage = {
    jsChunk,
    url: process.argv[2] || './sample/app-shell.js'
  };

  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto('file://' + absolutePath);

      // Get the "viewport" of the page, as reported by the page.
      const pageData = await page.evaluate((processPage) => {
        function isFunction(obj) {
          var type = typeof obj;
          // return type === 'function' || type === 'object' && !!obj;
          return type === 'function' && !!obj;
        }

        function isObject(obj) {
          var type = typeof obj;
          return type === 'object' && !!obj;
        }

        function iterationCopy(src, skipJunk = true, jsChunk = '') {
          let target = { constructor: {}, functions: {} };
          for (let prop in src) {
            if (src.hasOwnProperty(prop) && (skipJunk || jsChunk.indexOf(prop) > 0)) {
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
        return window.loadScriptAsync(processPage.url)
          .then(() => iterationCopy(window, false, processPage.jsChunk))
          .finally(() => window.removeScript());
      }, processPage);
      await browser.close();
      return resolve(pageData);
    } catch (e) {
      return reject(e);
    }
  });
}
browserPageLoad().then((res) => console.log(res));