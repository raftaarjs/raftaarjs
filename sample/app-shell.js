var books = [
  { title: 'Game of Thrones', pages: 697 },
  { title: 'The Ice Dragon', pages: 521 }
];

this.myFunc = () => {
  console.log(document.getElementById('myBooks'));
}

this.connectedCallback = () => {
  this.myFunc();
}