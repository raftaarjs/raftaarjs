
import { LitElement, html, css, } from 'lit-element';

import './app-content.js';

class NotFound extends LitElement {

  static get styles() {
    return css`
      h1 {
        font-size: 96px;
        margin-bottom: 0px;
      }
      h1, h2 {
        text-align: center;
      }
    `;
  }

  render() {
    return html`
    <app-content>
        <h1>404</h1>
        <h2>Page Not Found</h2>
    </app-content>
    `;
  }

  static get properties() {
    return {
    };
  }

  constructor() {
    super();
  }
}

customElements.define('not-found', NotFound);
