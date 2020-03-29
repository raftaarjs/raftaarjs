import { LitElement, html } from 'lit-element';

import './app-content';
import './lazy-element';
// import './dynamic-import';

class DynamicTests extends LitElement {
  render() {
    return html`
      <app-content title="${this.title}">
        <h2>Dynamic data-if Attribute</h2>
        ${this.showBox ? html`<div class="articles">
          <lazy-element element="dynamic-import"><dynamic-import></dynamic-import></lazy-element>
          Some Other Content
        </div>` : html`<div class="not-articles">The box is Hidden</div>`}
  
        <button @click="${() => this._showMyBox()}">Toggle Box</button>
        <br>
      </app-content>
    `;
  }
  static get properties() {
    return {
      title: String,
      showBox: Boolean,
      dynamicImportLoaded: Boolean,
    };
  }
  constructor() {
    super(), this.title = 'Tests of Functionality', this.showBox = !1;
    this.dynamicImportLoaded = false;
  }

  _showMyBox() {
    this.showBox = !this.showBox;
  }
}

customElements.define('dynamic-tests', DynamicTests);
