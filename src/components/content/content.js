this.title = '';
this.meta = [];

this.firstUpdated = () => {
  window.document.title = `${this.title} - Raftaar JS`;
};
