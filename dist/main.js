
    import { LitElement, html, css } from 'lit-element';

    // 

    class AppShell extends LitElement {

      static get styles() {
        return [
          css`
            ul {
  padding: 40px;
}

input, button {
    padding: var(--base-input-padding);
}
          `,
        ];
      }

      render() {
        return html`
          <h1>Users</h1>
<input id="usernameInput" name="username">
      <button @click="${() => this._addUsername()}">Add user</button>
      <ul>
        ${this.users.map(user => html`
          <li>${user}</li>
        `)}
      </ul>
        `;
      }
      
        
    static get properties() {
      return {
         users: Object,
      
      };
    }

    constructor(){
      super();
      
  
   this.users = ["steve"];
    
    }
  
        
   _addUsername()  {
  this.users = [...this.users, this.usernameInput().value];

  // Use the input getter and clear the value
  this.usernameInput().value = '';
}
       usernameInput()  {
  return this.shadowRoot.getElementById('usernameInput');
}
      
      
    }

    customElements.define('app-shell', AppShell);
  