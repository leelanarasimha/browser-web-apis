let count = 0;
const worker = new Worker('webworker.js');

const user = {
  name: 'Leela',
  age: 30,
  location: 'Earth'
};

worker.postMessage(user);

worker.onmessage = function (event) {
  console.log(event.data);
};
