if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/service-worker.js'));
}

function objReset(obj) {
  if(typeof obj !== 'object') return obj;
  if(Array.isArray(obj)) {
    var _obj = obj.concat();
    obj = [];
    return _obj.concat();
  } else {
    return Object.assign({}, obj);
  }

}