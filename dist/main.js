
import { LitElement, html, css } from 'lit-element';

// 

class AppShell extends LitElement {

  static get styles() {
    return [
      css`
        h1 {
          text-align: center;
        }
      `,
    ];
  }

  render() {
    return html`
          <h1>Welcome to Dark Web</h1>
          <p>${this.subtitle}</p>
        `;
  }

  //       this.subtitle = 'It is very dark here';
  // this.numeric = 123;

  // this.obja = { d: 'a', c: this.numeric };
  // this.aara = [1, 2, 3, 4, 5];
  // this.stringArra = ['dennis', 'the', 'menance'];

  // this.onWebsiteEnter = () => {
  //   return this.onWebsiteEnterEs5;
  // }

  // this.onWebsiteEnterEs5 = function () {
  //   return 'some content';
  // }


}

customElements.define('app-shell', AppShell);
