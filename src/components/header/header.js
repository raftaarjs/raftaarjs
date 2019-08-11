this.brand = 'RaftaarJS';
this.navlinks = [
  { name: 'Home', url: './' },
  { name: 'Moto', url: './moto' },
  { name: 'Authors', url: './authors' },
  { name: 'Contact', url: './contact' }
];

this._checkPath = (url, loc) => {
  if(url === '.' + loc) {
    return 'active'
  }
  return '';
}