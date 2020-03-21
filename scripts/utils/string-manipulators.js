/* eslint-disable no-restricted-syntax */
function componentizeName(str) {
  if (str.indexOf('-') > 0) {
    return str;
  }
  return `app-${str}`;
}

function camelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function defaultCamelCase(str) {
  return camelCase(componentizeName(str));
}

function pascalCase(str) {
  const camelStr = camelCase(str);
  return camelStr.charAt(0).toUpperCase() + camelStr.slice(1);
}

function defaultPascalCase(str) {
  return pascalCase(componentizeName(str));
}

function getFileExtension(filename) {
  return filename.split('.').pop();
}

function getFilenamePrefix(filename) {
  return filename.split('.').shift();
}

function bracesToLiterals(str) {
  return str.replace(/{{/g, '${').replace(/}}/g, '}');
}

function getForEachCondition(forEacher) {
  const forEacherItems = forEacher.replace(/{{/g, '').replace(/}}/g, '').split(' in ');
  const itemName = forEacherItems[0].trim();
  const itemListScope = forEacherItems[1].trim();

  return { itemName, itemListScope };
}

function enlistAttributes(attribsObj) {
  const arrayManipulatorAttribute = 'data-foreach';
  const conditionMatchManipulatorAttribute = 'data-if';
  const conditionUnmatchManipulatorAttribute = 'data-else';
  let attributes = '';
  const entries = Object.entries(attribsObj);

  for (const [attr, val] of entries) {
    const isAttrConditions = attr !== arrayManipulatorAttribute
      && attr !== conditionMatchManipulatorAttribute
      && attr !== conditionUnmatchManipulatorAttribute;

    if (isAttrConditions) {
      attributes += `${attr}="${val}" `;
    }
  }

  return attributes;
}

function addFakeTag(parsedHTML) {
  const fakeElementPrefix = 'raftaar-fake-';
  return parsedHTML
    .replace(/<tr/g, `<${fakeElementPrefix}tr`)
    .replace(/<\/tr/g, `</${fakeElementPrefix}tr`)
    .replace(/<table/g, `<${fakeElementPrefix}table`)
    .replace(/<\/table/g, `</${fakeElementPrefix}table`)
    .replace(/<td/g, `<${fakeElementPrefix}td`)
    .replace(/<\/td/g, `</${fakeElementPrefix}td`)
    .replace(/<th/g, `<${fakeElementPrefix}th`)
    .replace(/<\/th/g, `</${fakeElementPrefix}th`)
    .replace(/<thead/g, `<${fakeElementPrefix}thead`)
    .replace(/<\/thead/g, `</${fakeElementPrefix}thead`)
    .replace(/<tfoot/g, `<${fakeElementPrefix}tfoot`)
    .replace(/<\/tfoot/g, `</${fakeElementPrefix}tfoot`)
    .replace(/<tbody/g, `<${fakeElementPrefix}tbody`)
    .replace(/<\/tbody/g, `</${fakeElementPrefix}tbody`);
}

function removeFakeTag(parsedHTML) {
  return parsedHTML
    .replace(/<raftaar-fake-tr/g, '<tr')
    .replace(/<\/raftaar-fake-tr/g, '</tr')
    .replace(/<raftaar-fake-table/g, '<table')
    .replace(/<\/raftaar-fake-table/g, '</table')
    .replace(/<raftaar-fake-td/g, '<td')
    .replace(/<\/raftaar-fake-td/g, '</td')
    .replace(/<raftaar-fake-th/g, '<th')
    .replace(/<\/raftaar-fake-th/g, '</th')
    .replace(/<raftaar-fake-thead/g, '<thead')
    .replace(/<\/raftaar-fake-thead/g, '</thead')
    .replace(/<raftaar-fake-tfoot/g, '<tfoot')
    .replace(/<\/raftaar-fake-tfoot/g, '</tfoot')
    .replace(/<raftaar-fake-tbody/g, '<tbody')
    .replace(/<\/raftaar-fake-tbody/g, '</tbody')
    .replace(/=&gt;/g, '=>');
}

module.exports = {
  camelCase,
  defaultCamelCase,
  pascalCase,
  defaultPascalCase,
  componentizeName,
  getFileExtension,
  getFilenamePrefix,
  bracesToLiterals,
  getForEachCondition,
  enlistAttributes,
  addFakeTag,
  removeFakeTag,
};
