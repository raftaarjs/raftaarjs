import { LitElement, html } from 'lit-element';
import dimport from 'dimport';

class LazyElement extends LitElement {
  render() {
    return html`
      ${this.isRegistered(this.element) && this.dynamicImportLoaded ? html`<slot></slot>` : this.loadComponent(this.element)}
    `;
  }

  static get properties() {
    return {
      element: String,
      dynamicImportLoaded: Boolean,
    };
  }

  constructor() {
    super();
    this.dynamicImportLoaded = false;
  }

  isRegistered(name) {
    return document.createElement(name).constructor !== HTMLElement;
  }

  loadComponent(componentName) {
    dimport(`./components/${componentName}.js`).then(() => { this.dynamicImportLoaded = true; });
    return html`Loading...`;
  }
}

customElements.define('lazy-element', LazyElement);
