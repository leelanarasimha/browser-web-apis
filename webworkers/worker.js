console.log('A');
importScripts('./math.js');
console.log('B');

importScripts('./math.js', './utils.js', './validation.js');
self.onmessage = (event) => {
  const result = square(event.data);
  self.postMessage(result);
};
