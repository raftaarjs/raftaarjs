
  export function camelCase(str) {
    return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
  }

  export function defaultCamelCase(str) {
    return camelCase(componentizeName(str));
  }

  export function componentizeName(str) {
    if (str.indexOf('-') > 0) {
      return str;
    }
    return 'app-' + str;
  }

  export function getFileExtension(filename) {
    return filename.split('.').pop();
  }

  export function getFilenamePrefix(filename) {
    return filename.split('.').shift();
  }