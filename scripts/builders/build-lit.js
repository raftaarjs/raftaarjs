const cheerio = require('cheerio');
const _ = require('lodash');
const defaultHTML5 = require('./default-html-five.json');

const {
  bracesToLiterals,
  getForEachCondition,
  enlistAttributes,
  addFakeTag,
  removeFakeTag,
} = require('../utils/string-manipulators');

const arrayManipulatorAttribute = 'data-foreach';
const conditionManipulatorAttribute = 'data-if';

function buildLitArrayMapString(iteratorHTML, itemListScope, itemName) {
  return `${'${'}${itemListScope}.map((${itemName}, index) => html\`${iteratorHTML}\`)${'}'}`;
}

function buildLitConditionString(successHTML = '', otherHTML = '', conditionScope) {
  return `${'${'}${conditionScope} ? html\`${successHTML}\` : html\`${otherHTML}\`${'}'}`;
}

function propertiesFunc(jsProps) {
  if (jsProps) {
    return `
      static get properties() {
        return {
          ${jsProps}
        };
      }
    `;
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
    `;
  }
  return '';
}

function printStyles(parsedCSS, cssLiterals = 'css') {
  if (parsedCSS) {
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
  if (parsedHTML) {
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

function reformArrayElement(arrayElementItem) {
  let { element, children } = arrayElementItem;
  if (element === 'tr' || element === 'table' || element === 'tbody') {
    const fakeElementPrefix = 'raftaar-fake-';
    element = fakeElementPrefix + element;
    const newChildren = [];
    children.forEach((child) => {
      newChildren.push(fakeElementPrefix + child);
    });

    children = [...newChildren];
  }

  return { element, children };
}

function buildLitArrayMap(parsedHTML) {
  const strippedHTML = addFakeTag(parsedHTML);
  const $ = cheerio.load(strippedHTML);

  defaultHTML5.arrayElements.forEach((arrayElementItem) => {
    const { element, children } = reformArrayElement(arrayElementItem);

    if ($(`${element}[${arrayManipulatorAttribute}]`).attr(arrayManipulatorAttribute)) {
      $(`${element}[data-foreach]`).children().each((i, item) => {
        if (!_.includes(children, item.name)) {
          // eslint-disable-next-line no-console
          console.error(`Incorrect HTML Syntax. ${item.name} inside a ${element} in ${parsedHTML}`);
          process.exit(99);
        }
      });

      $(`${element}[${arrayManipulatorAttribute}]`).replaceWith(function replace() {
        const forEacher = $(this).attr(arrayManipulatorAttribute);
        const { itemName, itemListScope } = getForEachCondition(forEacher);
        let iteratorHTML = $(this).html();
        iteratorHTML = bracesToLiterals(iteratorHTML);
        const mapHTML = buildLitArrayMapString(iteratorHTML, itemListScope, itemName);
        const attributes = enlistAttributes($(this)[0].attribs);
        return `<${element} ${attributes}>${mapHTML}</${element}>`;
      });
    }
  });

  const sanatizedHTML = removeFakeTag($('body').html());

  return sanatizedHTML;
}

function buildLitCondition(parsedHTML) {
  const $ = cheerio.load(parsedHTML);
  if ($(`[${conditionManipulatorAttribute}]`).attr(conditionManipulatorAttribute)) {
    $(`[${conditionManipulatorAttribute}]`).replaceWith(function replace() {
      const conditionScope = $(this).attr(conditionManipulatorAttribute);
      let otherHTML = '';
      const elseAttr = $(this).next().attr('data-else');

      if (typeof elseAttr !== typeof undefined && elseAttr !== false) {
        const otherattributes = enlistAttributes($(this).next()[0].attribs);
        otherHTML = `<${$(this).next()[0].name} ${otherattributes}>${$(this).next().html()}</${$(this).next()[0].name}>`;
        $(this).next().remove();
      }

      const attributes = enlistAttributes($(this)[0].attribs);
      const successHTML = `<${$(this)[0].name} ${attributes}>${$(this).html()}</${$(this)[0].name}>`;
      const mapHTML = buildLitConditionString(successHTML, otherHTML, conditionScope);
      return mapHTML;
    });
  }

  const sanatizedHTML = $('body').html().replace(/=&gt;/g, '=>');

  return sanatizedHTML;
}

function processHTML(parsedHTML) {
  const conditionSortedHTML = buildLitCondition(parsedHTML);
  const arraySortedHTML = buildLitArrayMap(conditionSortedHTML);
  const htmlSupportedLiteral = bracesToLiterals(arraySortedHTML);
  const htmlChunk = printHTML(htmlSupportedLiteral);
  return Promise.resolve(htmlChunk);
}

function processCSS(parsedCSS) {
  const cssChunk = printStyles(parsedCSS);
  return cssChunk;
}

function processJS(parsedJS) {
  const {
    jsProps, jsCnstrAttribs, jsFuncs, importChunk,
  } = parsedJS;
  let jsChunk = '';
  jsChunk = propertiesFunc(jsProps);
  jsChunk += constructorFunc(jsCnstrAttribs);
  jsChunk += jsFuncs;
  return { jsChunk, importChunk };
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

module.exports = {
  processHTML, processCSS, processJS, buildShell,
};
