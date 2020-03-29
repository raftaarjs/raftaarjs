/* eslint-disable no-restricted-syntax */
const cheerio = require('cheerio');
const _ = require('lodash');
const defaultHTML5 = require('./default-html-five.json');

const {
  bracesToLiterals,
  getForEachCondition,
  enlistAttributes,
  enlistRawAttributes,
  addFakeTag,
  removeFakeTag,
} = require('../utils/string-manipulators');

const arrayManipulatorAttribute = 'data-foreach';
const conditionManipulatorAttribute = 'data-if';
const elseConditionManipulatorAttribute = 'data-else';
let nonDataIfWC = {};
let dataIfWC = {};

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

function buildLitBooleanAttribs(parsedHTML) {
  const $ = cheerio.load(parsedHTML);
  nonDataIfWC = {};
  dataIfWC = {};

  $('*').each((i, item) => {
    const tagName = $(item)[0].name;
    if (tagName.indexOf('-') > -1) {
      if (nonDataIfWC[tagName]) {
        // eslint-disable-next-line operator-assignment
        nonDataIfWC[tagName] = nonDataIfWC[tagName] + 1;
      } else {
        nonDataIfWC[tagName] = 1;
      }
    }
    let attributes = '';
    const entries = Object.entries($(item)[0].attribs);
    let canUpdateItem = false;

    // eslint-disable-next-line prefer-const
    for (let [attr, val] of entries) {
      const isAttrBoolean = _.includes(defaultHTML5.booleanAttributes, attr);
      const attrHasValue = val.indexOf('}}') > -1;

      if (isAttrBoolean && attrHasValue) {
        canUpdateItem = true;
        attr = `?${attr}`;
      }
      attributes += `${attr}="${val}" `;
    }

    if (canUpdateItem) {
      $(item).replaceWith(function replace() {
        return `<${$(this)[0].name} ${attributes}>${$(this).html()}</${$(this)[0].name}>`;
      });
    }
  });

  const sanatizedHTML = $('body').html().replace(/=&gt;/g, '=>');

  return sanatizedHTML;
}

function buildLitCondition(parsedHTML) {
  const $ = cheerio.load(parsedHTML);
  const removeImports = [];

  $(`[${conditionManipulatorAttribute}]`).children().each((i, item) => {
    const tagName = $(item)[0].name;
    if (tagName.indexOf('-') > -1) {
      if (dataIfWC[tagName]) {
        dataIfWC[tagName] = dataIfWC[tagName]++;
      } else {
        dataIfWC[tagName] = 1;
      }
    }
  });

  if ($(`[${conditionManipulatorAttribute}]`).attr(conditionManipulatorAttribute)) {
    $(`[${conditionManipulatorAttribute}]`).replaceWith(function replace() {
      const conditionScope = $(this).attr(conditionManipulatorAttribute).replace(/{{/, '').replace(/}}/, '');
      let otherHTML = '';
      const elseAttr = $(this).next().attr(elseConditionManipulatorAttribute);

      if (typeof elseAttr !== typeof undefined && elseAttr !== false) {
        const otherattributes = enlistAttributes($(this).next()[0].attribs);
        otherHTML = `<${$(this).next()[0].name} ${otherattributes}>${$(this).next().html()}</${$(this).next()[0].name}>`;
        $(this).next().remove();
      }

      $(this).children().each((i, item) => {
        const tagName = $(item)[0].name;
        if (tagName.indexOf('-') > -1) {
          if (nonDataIfWC[tagName] === dataIfWC[tagName]) {
            nonDataIfWC[tagName] = 0;
            dataIfWC[tagName] = 0;
            $(item).replaceWith(function addLazy() {
              const attributes = enlistRawAttributes($(this)[0].attribs);
              return `<lazy-element element="${$(this)[0].name}"><${$(this)[0].name} ${attributes}>${$(this).html()}</${$(this)[0].name}></lazy-element>`;
            });
            removeImports.push(tagName);
          }
        }
      });

      const attributes = enlistAttributes($(this)[0].attribs);
      const successHTML = `<${$(this)[0].name} ${attributes}>${$(this).html()}</${$(this)[0].name}>`;
      const mapHTML = buildLitConditionString(successHTML, otherHTML, conditionScope);
      return mapHTML;
    });
  }

  const sanatizedHTML = $('body').html().replace(/=&gt;/g, '=>');

  return { conditionSortedHTML: sanatizedHTML, removeImports };
}

function processHTML(parsedHTML) {
  const booleanAttribHTML = buildLitBooleanAttribs(parsedHTML);
  const { removeImports, conditionSortedHTML } = buildLitCondition(booleanAttribHTML);
  const arraySortedHTML = buildLitArrayMap(conditionSortedHTML);
  const htmlSupportedLiteral = bracesToLiterals(arraySortedHTML);
  const htmlChunk = printHTML(htmlSupportedLiteral);
  return Promise.resolve({ htmlChunk, removeImports });
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
  import { LitElement, html, css } from 'lit-element';
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
