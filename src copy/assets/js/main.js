import { LitElement, html, css } from 'lit-element';

class AppShell extends LitElement {
  static get properties() {
    return {
      title: { type: String },
    };
  }

  constructor() {
    super();
    this.title = 'RaftaarJS';
  }

  static get styles() {
    return [
      css`
        :host {
          text-align: center;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: calc(10px + 2vmin);
          color: #1a2b42;
        }
        header {
          margin: auto;
        }
        a {
          color: #217ff9;
        }
        .app-footer {
          color: #a8a8a8;
          font-size: calc(10px + 0.5vmin);
        }
      `,
    ];
  }

  render() {
    return html`
      <header class="app-header">
        <h1>${this.title}</h1>
        <p>Full Setup is on its way</p>
      </header>
      <p class="app-footer">
        🚽 Made with love by
        <a target="_blank" rel="noopener noreferrer" href="https://sooryen.com">Sooryen Technologies</a>.
      </p>
    `;
  }
}

customElements.define('app-shell', AppShell);