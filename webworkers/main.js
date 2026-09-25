const worker = new Worker('./worker.js');
console.log('hi');

worker.onmessage = (event) => {
  console.log('Main received:', event.data);
};

worker.postMessage(10);
