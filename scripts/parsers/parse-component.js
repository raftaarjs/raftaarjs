const vm = require('vm');

/**
 * TODO: AST Transfer will happen here using babel. Current Logic is for demo purposes
 */
function prepareComponent({ componentAttribs, FrontendFramework, importChunk, htmlChunk, cssChunk, jsChunk }) {
  if (!FrontendFramework) {
    FrontendFramework = {
      imports: ['LitElement', 'html', 'css'],
      tagName: 'lit-element',
      className: 'LitElement',
      literalTags: {
        css: 'css',
        html: 'html',
      }
    };
  }

  if (!componentAttribs) {
    const randomizeComponent = (Math.random() * 1000000).toFixed();
    componentAttribs = {
      tagName: 'app-component' + randomizeComponent,
      className: 'AppComponent' + randomizeComponent,
    }
  }

  /**
   * 
   * @param {string} jsChunk String format of all javascript
   * 
   * TODO: Make a babel check and compile
   */
  function checkJS(jsChunk) {
    // if(new vm.Script(jsChunk)) {
    return jsChunk;
    // }
    // return '';
  }

  function iterateFWImports(fwImports) {
    if (Array.isArray(fwImports)) {
      ImportsCommaString = '';
      fwImports.forEach(anImport => {
        ImportsCommaString += anImport + ', ';
      });
      return ImportsCommaString;
    }
    return fwImports || '';
  }

  function iterateImports(importChunk) {
    if (Array.isArray(importChunk)) {
      ImportLines = '';
      importChunk.forEach(anImport => {
        ImportLines += anImport + `;
        `;
      });
      return ImportLines;
    }
    return importChunk || '';
  }


  /**
   * TODO: This will formed using AST when we go ahead
   */
  let completeStructure = `
      import { ${iterateFWImports(FrontendFramework.imports)} } from '${FrontendFramework.tagName}';
  
      ${iterateImports(importChunk)}

      class ${componentAttribs.className} extends ${FrontendFramework.className} {
        ${cssChunk}
        ${htmlChunk}
        ${checkJS(jsChunk)}
      }
  
      customElements.define('${componentAttribs.tagName}', ${componentAttribs.className});
    `;
  return completeStructure;
}

module.exports = { prepareComponent };