/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const { readFile } = require('../utils/readers');
const { writeTempFile } = require('../utils/writers');
const { browserPageLoad } = require('./browser-load');

function removeFirstFunctionString(str) {
  return str.replace(/function/, ''); // Remove the first one
}

function removeFirstArrowString(str) {
  return str.replace('=>', '');
}

function getImportLines(str) {
  const lines = str.split('\n');
  const importChunk = [];
  lines.forEach((line) => {
    if (line.indexOf('import ') >= 0) {
      importChunk.push(`${line}`);
    }
  });
  return importChunk;
}

function shadowDomize(curFunc) {
  return curFunc.replace(/ document./g, ' this.shadowRoot.');
}

function createConstructor(cnstr) {
  let jsCnstrAttribs = '';
  let jsProps = '';
  for (const attr in cnstr) {
    if (typeof cnstr[attr] === 'object') {
      jsProps += ` ${attr}: Object,
      `;
      jsCnstrAttribs += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
      `;
    } else if (Array.isArray(cnstr[attr])) {
      jsProps += ` ${attr}: Array,
      `;
      jsCnstrAttribs += ` this.${attr} = ${JSON.stringify(cnstr[attr])};
      `;
    } else if (typeof cnstr[attr] === 'number') {
      jsProps += ` ${attr}: Number,
      `;
      jsCnstrAttribs += ` this.${attr} = ${cnstr[attr]};
      `;
    } else if (typeof cnstr[attr] === 'boolean') {
      jsProps += ` ${attr}: Boolean,
      `;
      jsCnstrAttribs += ` this.${attr} = ${cnstr[attr]};
    `;
    } else {
      jsProps += ` ${attr}: String,
      `;
      jsCnstrAttribs += ` this.${attr} = '${cnstr[attr]}';
    `;
    }
  }

  return { jsProps, jsCnstrAttribs };
}

function sortFunctions(funcs) {
  let functionList = `
  `;

  for (const func in funcs) {
    let curFunc = funcs[func];

    curFunc = shadowDomize(curFunc);

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

    // eslint-disable-next-line no-param-reassign
    funcs[func] = curFunc;
  }
  return functionList;
}

function prepareJS(filePath) {
  const jsRaw = readFile(filePath);
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const importChunk = getImportLines(jsRaw);
    const nonImportJS = jsRaw.trim().replace(/import .*$/mg, '');
    const sanitizeFilePath = filePath.replace(/.js/, '-sanitized.js');
    const tempFilePath = await writeTempFile(sanitizeFilePath, nonImportJS);

    browserPageLoad({ jsRaw: nonImportJS, filePath: tempFilePath })
      .then((jsObj) => {
        const { jsProps, jsCnstrAttribs } = createConstructor(jsObj.constructor);

        const jsFuncs = sortFunctions(jsObj.functions);

        const parsedJS = {
          importChunk, jsProps, jsCnstrAttribs, jsFuncs,
        };

        return resolve(parsedJS);
      });
  });
}

module.exports = { prepareJS };
