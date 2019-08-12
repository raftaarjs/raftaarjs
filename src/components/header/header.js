this.brand = 'RaftaarJS';
this.firstLoad = false;
this.navlinks = [
  { name: 'Home', url: './', active: false },
  { name: 'Moto', url: './moto', active: false },
  { name: 'Authors', url: './authors', active: false },
  { name: 'Contact', url: './contact', active: false }
];

this._setActive = (index) => {
  this.navlinks.forEach(navlink => navlink.active = false);
  this.navlinks[index].active = true;
  this.navlinks = window.objReset(this.navlinks);
}

this._getActive = (navlink) => {
  if(navlink.active === true) return 'active';
  else if(navlink.url === '.' + location.pathname && !this.firstLoad) {
    this.firstLoad = true;
    return 'active';
  }
  return '';
}