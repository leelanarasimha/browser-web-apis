self.onmessage = async (event) => {
  if (event.data.type === 'FETCH_BINARY') {
    const response = await fetch('./sample.bin');
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = 255 - bytes[i];
    }

    console.log('before transfer', buffer.byteLength);
    self.postMessage({ buffer }, [buffer]);
    console.log('After transfer:', buffer.byteLength);

    // const bytes = new Uint8Array(buffer);
    // let sum = 0;
    // for (const byte of bytes) {
    //   sum += byte;
    // }

    // self.postMessage({
    //   byteLength: buffer.byteLength,
    //   sum
    // });
    // console.log('Worker: Fetched binary data:', bytes);
    // console.log('array buffer', buffer);
  }
};
