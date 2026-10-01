self.onmessage = (event) => {
  const { taskId, value } = event.data;
  console.log(`Worker: Received taskId ${taskId} with value ${value}`);
  let result = 0;
  for (let i = 0; i < value * 10_000_00000; i++) {
    result += i % 10;
  }
  self.postMessage({ taskId, result });
};
