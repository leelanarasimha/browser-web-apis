self.onmessage = (event) => {
  const sharedArray = new Int32Array(event.data);
  console.log('Worker - Before:', sharedArray[0]);
  sharedArray[0] = 500;
  console.log('Worker - After:', sharedArray[0]);
  self.postMessage('DONE');
};
