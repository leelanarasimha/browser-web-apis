self.onmessage = (event) => {
  const { id, value } = event.data;
  const iterationCount = 1000000000 * value;
  let result = 0;
  for (let i = 0; i < iterationCount; i++) {
    result += i % 10;
  }
  self.postMessage({ id, result });
};
