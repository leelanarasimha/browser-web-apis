const channel = new MessageChannel();

worker.postMessage('Here is your communication port', [channel.port1]);

worker.postMessage({
  name: 'john',
  age: 40
});

channel.port1.onmessage = (event) => {
  console.log('Port 1:', event.data);
};

channel.port2.onmessage = (event) => {
  console.log('Port 2:', event.data);
};

channel.port1.postMessage('Hello from Port 1');
channel.port2.postMessage('Hello from Port 2');

worker.postMessage(
  {
    type: 'PORT'
  },
  [channel.port1]
);

worker.postMessage(buffer, [buffer]);
