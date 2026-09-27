const channel = new MessageChannel();

channel.port1.postMessage('Hello from worker');

channel.port2.onmessage = (event) => {
  console.log('Message received on port2:', event.data);
};
