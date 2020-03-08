import './app-content'

this.emails = ['steve'];

this._addEmail = () => {
  this.emails = [...this.emails, this.emailInput().value];
  this.emailInput().value = '';
}

this.emailInput = () => {
  return this.shadowRoot.getElementById('emailInput');
}