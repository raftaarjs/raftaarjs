let { readFile } = require('../utils/readers');
let { writeTempFile } = require('../utils/writers');
let { browserPageLoad } = require('./browser-load');


function prepareJS(filePath) {
  let jsRaw = readFile(filePath);
  return new Promise(async (resolve, reject) => {

    let importChunk = getImportLines(jsRaw);
    let nonImportJS = jsRaw.replace(/^import .*$/m, '');
    let tempFilePath = await writeTempFile(filePath, nonImportJS);

    browserPageLoad({ jsRaw: nonImportJS, filePath: tempFilePath })
      .then((jsObj) => {
        let { jsProps, jsCnstrAttribs } = createConstructor(jsObj.constructor);

        let jsFuncs = sortFunctions(jsObj.functions);

        parsedJS = { importChunk, jsProps, jsCnstrAttribs, jsFuncs };

        return resolve(parsedJS);
      });
  });
}

function createConstructor(cnstr) {
  let jsCnstrAttribs = ``;
  let jsProps = ``;
  for (let attr in cnstr) {
    if (typeof cnstr[attr] === 'object') {
      jsProps += ` ${attr}: Object,
      `
      jsCnstrAttribs += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
    `;
    } else if (Array.isArray(cnstr[attr])) {
      jsProps += ` ${attr}: Array,
      `
      jsCnstrAttribs += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
    `;
    } else if (typeof cnstr[attr] === 'number') {
      jsProps += ` ${attr}: Number,
      `
      jsCnstrAttribs += ` this.${attr} = ${cnstr[attr]};
    `;
    } else if (typeof cnstr[attr] === 'boolean') {
      jsProps += ` ${attr}: Boolean,
      `
      jsCnstrAttribs += ` this.${attr} = ${cnstr[attr]};
    `;
    } else {
      jsProps += ` ${attr}: String,
      `
      jsCnstrAttribs += ` this.${attr} = '${cnstr[attr]}';
    `;
    }
  }

  return { jsProps, jsCnstrAttribs };
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
      curFunc = removeFirstArrowString(curFunc);
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
  str = str.replace('=>', ''); 
  return str;
}

function getImportLines(str) {
  var lines = str.split('\n');
  let importChunk = [];
  lines.forEach(line => {
    if (line.indexOf('import ') >= 0) {
      importChunk.push(`${line}`);
    } 
  });
  return importChunk;
}

function shadoDomize(curFunc) {
  return curFunc.replace(/document./g, "this.shadowRoot.");
}

module.exports = { prepareJS };