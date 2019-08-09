this.users = ['steve'];

this._addUsername = () => {
  this.users = [...this.users, this.usernameInput().value];

  // Use the input getter and clear the value
  this.usernameInput().value = '';
}

this.usernameInput = () => {
  return this.shadowRoot.getElementById('usernameInput');
}