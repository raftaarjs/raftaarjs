let config = {
    buildDir: './dist/',
    sourceDir: './src/',
  };
  
  config.componentsDir = config.sourceDir + 'components/';
  config.buildComponentsDir = config.buildDir + 'components/';
  config.importsDir = './components/';
  config.utilsDir = config.sourceDir + 'utils/';
  config.assetsDir = config.sourceDir + 'assets/';
  config.layoutComponent = 'app-layout';
  
  config.esmFramework = {
    builderName: 'build-lit',
    routerName: 'build-vaadin-router',
    imports: ['LitElement', 'html', 'css'],
    tagName: 'lit-element',
    className: 'LitElement',
    literalTags: {
      css: 'css',
      html: 'html',
    },
    // Understand the loading comparision and sequence:
    // sequence: https://plnkr.co/edit/K17sAQX6YDMfbN3J5HSH?p=preview
    // comparision: https://docs.google.com/spreadsheets/d/1W9dqzU2zr_0Es9HZwHi2UVULMLw0qCau168k7PbIZXI/edit?usp=sharing
    // Life Cycle Links:
    // Native Window: https://javascript.info/onload-ondomcontentloaded
    // Web Components: https://levelup.gitconnected.com/creating-web-components-lifecycle-callbacks-5b6ffa48a8d5
    // LitElement: https://lit-element.polymer-project.org/guide/lifecycle
    // React JS: https://blog.pusher.com/beginners-guide-react-component-lifecycle/
    // Vue JS: https://alligator.io/vuejs/component-lifecycle/
    // Angular: https://pusher.com/tutorials/lifecycle-hooks-angular
    lifeCycleMap: {
      'readyState': {
        'loading': 'constructor',
        'interactive': 'connectedCallback',
        'complete': 'render',
      },
      'DOMContentLoaded': 'update',
      'onload': 'firstUpdated',
      'onunload': 'disconnectedCallback',
      'onpopstate': 'shouldUpdate',
      'onhashchange': ['updated', 'adoptedCallback', 'attributeChangedCallback']
    },
    DOMManipulators: {
      'map': 'data-foreach',
      'if': 'data-if',
      'else': 'data-else'
    }
  };

  module.exports = config;