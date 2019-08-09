
    import { LitElement, html, css } from 'lit-element';

    // 

    class AppShell extends LitElement {

      static get styles() {
        return [
          css`
            ul {
  padding: 40px;
}
          `,
        ];
      }

      render() {
        return html`
          <h1>Books</h1>
<ul id="myBooks">${this.books.map(book => html`<li>${book.title} - ${book.pages}</li>`)}</ul>
        `;
      }
      
        
    static get properties() {
      return {
         books: Object,
      
      };
    }

    constructor(){
      super();
      
  
   this.books = [{"title":"Game of Thrones","pages":697},{"title":"The Ice Dragon","pages":521}];
    
    }
  
        
   myFunc()  {
  console.log(this.shadowRoot.getElementById('myBooks'));
}
       connectedCallback()  {
        super.connectedCallback();
  this.myFunc();
}
      
      
    }

    customElements.define('app-shell', AppShell);
  