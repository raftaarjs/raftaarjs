let config = {
    buildDir: './dist/',
    sourceDir: './src/',
  };
  
  config.componentsDir = config.sourceDir + 'components/';
  config.buildComponentsDir = config.buildDir + 'components/';
  config.utilsDir = config.sourceDir + 'utils/';
  config.assetsDir = config.sourceDir + 'assets/';
  
  config.frontendFramework = {
    builderName: 'build-lit',
    routerName: 'build-vaadin-router',
    imports: ['LitElement', 'html', 'css'],
    tagName: 'lit-element',
    className: 'LitElement',
    literalTags: {
      css: 'css',
      html: 'html',
    },
    lifeCycleMap: {
      'onload': 'firstUpdated',
      'onunload': 'disconnectedCallback'
    }
  };

  module.exports = config;