self.onmessage = (event) => {
  if (event.data.type === 'PORT') {
    const port = event.ports[0];

    console.log('Worker 1 received its port');

    port.onmessage = (event) => {
      console.log('Worker 1 received:', event.data);
    };

    port.postMessage('Hello Worker 2! This is Worker 1.');
  }
};
