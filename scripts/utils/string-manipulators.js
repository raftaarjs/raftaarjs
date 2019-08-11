
function camelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

function defaultCamelCase(str) {
  return camelCase(componentizeName(str));
}

function pascalCase(str) {
  let camelStr = camelCase(str);
  return camelStr.charAt(0).toUpperCase() + camelStr.slice(1);
}

function defaultPascalCase(str) {
  return pascalCase(componentizeName(str));
}

function componentizeName(str) {
  if (str.indexOf('-') > 0) {
    return str;
  }
  return 'app-' + str;
}

function getFileExtension(filename) {
  return filename.split('.').pop();
}

function getFilenamePrefix(filename) {
  return filename.split('.').shift();
}

module.exports = { camelCase, defaultCamelCase, pascalCase, defaultPascalCase, componentizeName, getFileExtension, getFilenamePrefix };