self.onmessage = (event) => {
  if (event.data.type === 'PORT') {
    const port = event.ports[0];

    console.log('Worker 2 received its port');

    port.onmessage = (event) => {
      console.log('Worker 2 received:', event.data);
    };

    port.postMessage('Hello Worker 1! This is Worker 2.');
  }
};
