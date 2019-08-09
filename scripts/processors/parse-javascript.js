// import { readFile } from '../utils/readers';
// import { browserPageLoad } from './browser-load';
let { readFile } = require('../utils/readers');
let { browserPageLoad } = require('./browser-load');


function prepareJS(filePath) {
  let jsRaw = readFile(filePath);
  return new Promise(async (resolve, reject) => {
    
    let { importChunk} = getImportLines(jsRaw);
    let nonImportJS = jsRaw.replace(/^import .*$/m, '');
    let jsChunk = ``;
    console.log(jsRaw);
    console.log('====================================');
    console.log(nonImportJS);
    browserPageLoad({ jsRaw, filePath }).then((jsObj) => {
      let jsCnstr = createConstructor(jsObj.constructor);

      let jsFuncs = sortFunctions(jsObj.functions);

      jsChunk = `
        ${jsCnstr}
        ${jsFuncs}
      `;

      return resolve(jsChunk);
    });
  });
}

function createConstructor(cnstr) {
  let attribList = `
  
  `;
  let propertiesList = ``;
  for (let attr in cnstr) {
    if (typeof cnstr[attr] === 'object') {
      propertiesList += ` ${attr}: Object,
      `
      attribList += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
    `;
    } else if (Array.isArray(cnstr[attr])) {
      propertiesList += ` ${attr}: Array,
      `
      attribList += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
    `;
    } else if (typeof cnstr[attr] === 'number') {
      propertiesList += ` ${attr}: Number,
      `
      attribList += ` this.${attr} = ${cnstr[attr]};
    `;
    } else if (typeof cnstr[attr] === 'boolean') {
      propertiesList += ` ${attr}: Boolean,
      `
      attribList += ` this.${attr} = ${cnstr[attr]};
    `;
    } else {
      propertiesList += ` ${attr}: String,
      `
      attribList += ` this.${attr} = '${cnstr[attr]}';
    `;
    }
  }

  return `
    static get properties() {
      return {
        ${propertiesList}
      };
    }

    constructor(){
      super();
      ${attribList}
    }
  `;
}

function sortFunctions(funcs) {
  let functionList = `
  `;

  for (let func in funcs) {
    let curFunc = funcs[func];

    curFunc = shadoDomize(curFunc);

    if (curFunc.startsWith('function(') || curFunc.startsWith('function (')) {
      curFunc = removeFirstFunctionString(curFunc);
      functionList += ` ${func}${curFunc}
      `;
    } else if (curFunc.startsWith('function')) {
      curFunc = removeFirstFunctionString(curFunc);
      functionList += ` ${curFunc}
      `;
    } else {
      curFunc = curFunc.replace(/=>/g, "");
      functionList += ` ${func}${curFunc}
      `;
    }

    funcs[func] = curFunc;
  }
  return functionList;
}


function removeFirstFunctionString(str) {
  str = str.replace(/function/, ''); // Remove the first one
  return str;
}

function removeFirstArrowString(str) {
  // if (str.match(/=>.*=>/)) { // Check if there are 2 commas
  str = str.replace(/=>/g, ''); // Remove the first one
  // }
}

function getImportLines(str) {
  var lines = str.split('\n');
  let nonImportJS = '';
  let importChunk = '';
  lines.forEach(line => {
    if(line.indexOf('import ') >= 0) {
      importChunk += line + '\n';
    } else {
      nonImportJS += line;
    }
  });
  return { importChunk, nonImportJS };
}

function shadoDomize(curFunc) {
  return curFunc.replace(/document./g, "this.shadowRoot.");
}

module.exports = { prepareJS };