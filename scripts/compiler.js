
// import { getAppObjectList } from './structures/app-structure';
// import { prepareHTML } from './processors/parse-html';
// import { prepareCSS } from './processors/parse-css';
// import { prepareJS } from './processors/parse-javascript';
let { prepareJS } = require('./processors/parse-javascript');


let config = {
  buildDir: './dist/',
  sourceDir: './src/',
};

config.componentsDir = config.sourceDir + 'components/';
config.utilsDir = config.sourceDir + 'utils/';
config.assetsDir = config.sourceDir + 'assets/';

const fs = require('fs');

// console.log(getAppObjectList(config));

function generateComponentJS(importChunk = '', htmlChunk = '', cssChunk = '', jsChunk = '') {
  let completeStructure = `
    import { LitElement, html, css } from 'lit-element';

    // ${importChunk}

    class AppShell extends LitElement {

      static get styles() {
        return [
          css\`
            ${cssChunk}
          \`,
        ];
      }

      render() {
        return html\`
          ${htmlChunk}
        \`;
      }
      ${jsChunk}
    }

    customElements.define('app-shell', AppShell);
  `;
  return completeStructure;
}

// fs.mkdir('./dist');

let htmlChunk = fs.readFileSync('./sample/app-shell.html', 'utf8');
let cssChunk = fs.readFileSync('./sample/app-shell.css', 'utf8');
// let jsChunk = fs.readFileSync('./sample/app-shell.js', 'utf8');
prepareJS('./sample/app-shell.js').then((jsChunk) => {
  fs.writeFile("./dist/main.js", generateComponentJS('', htmlChunk, cssChunk, jsChunk), function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("The file was saved!");
    }
  });
});

