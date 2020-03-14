import './app-content';

this.title = 'Tests of Functionality';
this.showBox = false;
this.showPara = false;
this.showWall = false;
this.wallButtonText = 'Hit The Wall';

this._showMyBox = () => {
  this.showBox = !this.showBox;
};

this._showMyPara = () => {
  this.showPara = !this.showPara;
};

this._showMyWall = () => {
  this.showWall = !this.showWall;
  this.wallButtonText = this.showWall ? 'Revive' : 'Hit The Wall';
};

const baseArray = [
  { name: 'Gaurav Panchal', handle: 'grvpanchal', url: 'http://github.com/grvpanchal' },
  { name: 'Mark Otto', handle: 'mdo', url: 'http://github.com/mdo' },
  { name: 'Justin Fagnani', handle: 'justinfagnani', url: 'http://github.com/justinfagnani' },
  { name: 'fat', handle: 'fat', url: 'http://github.com/fat' },
];

this.list = baseArray;
this.tableHead = ['No', 'name', 'Handle', 'URL'];
this.table = [
  { name: 'Gaurav Panchal', handle: 'grvpanchal', url: 'http://github.com/grvpanchal' },
  { name: 'Mark Otto', handle: 'mdo', url: 'http://github.com/mdo' },
  { name: 'Justin Fagnani', handle: 'justinfagnani', url: 'http://github.com/justinfagnani' },
  { name: 'fatty', handle: 'fat', url: 'http://github.com/fat' },
];

this.tableArray = [
  ['1', 'Gaurav Panchal', 'grvpanchal', 'http://github.com/grvpanchal'],
  ['2', 'Mark Otto', 'mdo', 'http://github.com/mdo'],
  ['3', 'Justin Fagnani', 'justinfagnani', 'http://github.com/justinfagnani'],
  ['4', 'fatty', 'fat', 'http://github.com/fat'],
];

this.images = [
  'https://via.placeholder.com/300x300.png',
  'https://via.placeholder.com/300x300.png',
  'https://via.placeholder.com/300x300.png',
  'https://via.placeholder.com/300x300.png',
  'https://via.placeholder.com/300x300.png',
  'https://via.placeholder.com/300x300.png',
];
