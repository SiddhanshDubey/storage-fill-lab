let stopped = false;
let buffer;
let pattern;
let waiting = false;

self.onmessage = (event) => {
  const data = event.data;
  if (data.type === 'stop') {
    stopped = true;
    return;
  }
  if (data.type === 'next') {
    if (waiting && !stopped) {
      waiting = false;
      emitChunk();
    }
    return;
  }
  if (data.type !== 'start') return;

  stopped = false;
  waiting = false;
  const chunkSize = data.chunkSize;
  const mode = data.mode;
  const encoder = new TextEncoder();

  if (mode === 'random') {
    buffer = new Uint8Array(chunkSize);
    pattern = null;
  } else {
    const source = mode === 'hex'
      ? 'DEADBEEF 00 FF A5 5A 13 37 | '
      : 'STORAGE-FILL-LAB | garbage test data | 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ | ';
    pattern = encoder.encode(source);
    buffer = new Uint8Array(chunkSize);
    for (let i = 0; i < buffer.length; i++) buffer[i] = pattern[i % pattern.length];
  }
  emitChunk();
};

function emitChunk() {
  if (stopped) {
    self.postMessage({ type: 'stopped' });
    return;
  }
  if (!pattern && buffer) crypto.getRandomValues(buffer);
  const copy = buffer.slice();
  waiting = true;
  self.postMessage({ type: 'chunk', buffer: copy.buffer }, [copy.buffer]);
}
