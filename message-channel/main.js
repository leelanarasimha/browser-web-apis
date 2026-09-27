const worker1 = new Worker('./worker1.js');
const worker2 = new Worker('./worker2.js');

const sharedBuffer = new SharedArrayBuffer(4);

const sharedArray = new Int32Array(sharedBuffer);

sharedArray[0] = 0;

worker1.postMessage(sharedBuffer);
worker2.postMessage(sharedBuffer);

setTimeout(() => {
  console.log('Final value:', sharedArray[0]);
}, 1000);
