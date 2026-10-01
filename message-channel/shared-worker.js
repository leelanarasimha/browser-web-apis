let count = 0;
const ports = [];
self.onconnect = (event) => {
  const port = event.ports[0];
  ports.push(port);
  port.postMessage(count);

  port.onmessage = (event) => {
    if (event.data === 'increment') {
      count++;
      ports.forEach((p) => p.postMessage(count));
    }
  };
};
