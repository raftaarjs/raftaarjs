function randomizeComponentNaming() {
  const randomizeComponent = (Math.random() * 1000000).toFixed();
  return {
    tagName: `app-component${randomizeComponent}`,
    className: `AppComponent${randomizeComponent}`,
  };
}

function getEsmFramework() {
  return {
    imports: ['LitElement', 'html', 'css'],
    tagName: 'lit-element',
    className: 'LitElement',
    literalTags: {
      css: 'css',
      html: 'html',
    },
  };
}
/**
 * TODO: AST Transfer will happen here using babel. Current Logic is for demo purposes
 */
function prepareComponent({
  componentAttribs = randomizeComponentNaming(),
  esmFramework = getEsmFramework(),
  importChunk,
  htmlChunk,
  cssChunk,
  jsChunk,
}) {
  /**
   *
   * @param {string} jsChunk String format of all javascript
   *
   * TODO: Make a babel check and compile
   */
  function checkJS(checkJsChunk) {
    return checkJsChunk;
  }

  function iterateFWImports(fwImports) {
    if (Array.isArray(fwImports)) {
      let ImportsCommaString = '';
      fwImports.forEach((anImport) => {
        ImportsCommaString += `${anImport}, `;
      });
      return ImportsCommaString;
    }
    return fwImports || '';
  }

  function iterateImports(iterateImportChunk) {
    if (Array.isArray(iterateImportChunk)) {
      let ImportLines = '';
      importChunk.forEach((anImport) => {
        ImportLines += `${anImport}
        `;
      });
      return ImportLines;
    }
    return importChunk || '';
  }


  /**
   * TODO: This will formed using AST when we go ahead
   */
  const completeStructure = `
      import { ${iterateFWImports(esmFramework.imports)} } from '${esmFramework.tagName}';
  
      ${iterateImports(importChunk)}

      class ${componentAttribs.className} extends ${esmFramework.className} {
        ${cssChunk}
        ${htmlChunk}
        ${checkJS(jsChunk)}
      }
  
      customElements.define('${componentAttribs.tagName}', ${componentAttribs.className});
    `;
  return completeStructure;
}

module.exports = { prepareComponent };
