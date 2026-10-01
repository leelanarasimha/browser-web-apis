const worker = new Worker('./worker.js');

worker.postMessage({
  type: 'FETCH_BINARY'
});

worker.onmessage = (event) => {
  const { buffer } = event.data;
  const bytes = new Uint8Array(buffer);
  console.log(bytes[0]);
  console.log(bytes[1]);
  console.log(bytes[2]);
  console.log('Main thread: Received buffer from worker:', buffer);
  console.log('Main thread: Buffer length:', buffer.byteLength);
};
