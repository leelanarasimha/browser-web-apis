const worker1 = new Worker('./worker1.js');

const worker2 = new Worker('./worker2.js');

const channel = new MessageChannel();

worker1.postMessage(
  {
    type: 'PORT'
  },
  [channel.port1]
);

worker2.postMessage(
  {
    type: 'PORT'
  },
  [channel.port2]
);
