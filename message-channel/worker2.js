self.onmessage = (event) => {
  const sharedArray = new Int32Array(event.data);

  for (let i = 0; i < 100000; i++) {
    sharedArray[0]++;
  }
};
