function propertiesFunc(jsProps) {
  if (jsProps) {
    return `
      static get properties() {
        return {
          ${jsProps}
        };
      }
    `
  }
  return '';
}

function constructorFunc(jsCnstrAttribs) {
  if (jsCnstrAttribs) {
    return `
      constructor(){
        super();
        ${jsCnstrAttribs}
      }
    `
  }
  return '';
}

function printStyles(parsedCSS, cssLiterals = 'css') {
  if(parsedCSS) {
    return `
      static get styles() {
        return [
          ${cssLiterals}\`
            ${parsedCSS}
          \`,
        ];
      }
    `;
  }
  return '';
}

function printHTML(parsedHTML, htmlLiterals = 'html') {
  if(parsedHTML) {
    return `
      render() {
        return ${htmlLiterals}\`
          ${parsedHTML}
        \`;
      }
    `;
  }
  return '';
}

function processHTML(parsedHTML) {
  let htmlChunk = printHTML(parsedHTML);
  return Promise.resolve(htmlChunk);
}

function processCSS(parsedCSS) {
  let cssChunk = printStyles(parsedCSS);
  return Promise.resolve(cssChunk);
}

function processJS(parsedJS) {
  let { jsProps, jsCnstrAttribs, jsFuncs, importChunk } = parsedJS;
  let jsChunk = ``;
  jsChunk = propertiesFunc(jsProps);
  jsChunk += constructorFunc(jsCnstrAttribs);
  jsChunk += jsFuncs
  return Promise.resolve({ jsChunk, importChunk } );
}

function buildShell(router, importsDir = './components/') {
  return Promise.resolve(`
  import { LitElement, html, css, } from 'lit-element';
  import {Router} from '@vaadin/router';
  import dimport from 'dimport';

  import '${importsDir}app-layout.js';
  
  class AppShell extends LitElement {
    static get styles() {
      return [css\`
          :host{
            display: block;
          }
        \`];
    }
  
    render() {
      return html\`
        <app-layout>
          <main></main>
        </app-layout>
      \`;
    }
  
    static get properties() {
      return {};
    }
  
    constructor() {
      super();
    }
  
    firstUpdated() {
      this.buildRoutes();  
    }

    buildRoutes() {
      const router = new Router(this.shadowRoot.querySelector('main'));
      router.setRoutes(${router});
    }
  }
  
  customElements.define('app-shell', AppShell);
  `);
}

module.exports = { processHTML, processCSS, processJS, buildShell };