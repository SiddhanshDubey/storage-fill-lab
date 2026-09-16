let stopped = false;
let buffer;
let pattern;

self.onmessage = (event) => {
  const data = event.data;
  if (data.type === 'stop') {
    stopped = true;
    return;
  }
  if (data.type !== 'start') return;

  stopped = false;
  const chunkSize = data.chunkSize;
  const mode = data.mode;
  const encoder = new TextEncoder();

  if (mode === 'random') {
    buffer = new Uint8Array(chunkSize);
  } else {
    const source = mode === 'hex'
      ? 'DEADBEEF 00 FF A5 5A 13 37 | '
      : 'STORAGE-FILL-LAB | garbage test data | 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ | ';
    pattern = encoder.encode(source);
    buffer = new Uint8Array(chunkSize);
    for (let i = 0; i < buffer.length; i++) buffer[i] = pattern[i % pattern.length];
  }

  while (!stopped) {
    if (mode === 'random') {
      crypto.getRandomValues(buffer);
    }
    const copy = buffer.slice();
    self.postMessage({ type: 'chunk', buffer: copy.buffer }, [copy.buffer]);
  }
  self.postMessage({ type: 'stopped' });
};
