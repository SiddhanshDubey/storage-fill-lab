# Storage Fill Lab

Lightweight browser-based generator for large local test files.

## Current architecture
- TXT generation with configurable target size.
- Experimental PDF mode.
- Payload modes: mixed text, zeros, hex-like data, and random bytes.
- Generation runs in `generator-worker.js` so the UI thread stays responsive.
- Reusable fixed-size buffers and backpressure prevent the worker from flooding browser memory.
- Direct large-file saving through the File System Access API when supported.
- Legacy browser-download fallback is intentionally limited to 4 GB because giant Blob downloads can exhaust memory or temporary storage.
- No server-side upload or storage.

## Large-file testing
For 100–200 GB tests, use **Save directly to a chosen folder** in a current Chromium-based browser with File System Access support. The generator writes small chunks incrementally; it does not construct a 100–200 GB JavaScript object in memory.

Performance modes:
- **Eco**: 1 MiB chunks for older/slower devices.
- **Balanced**: 4 MiB chunks.
- **Maximum throughput**: 16 MiB chunks.

## USB / phone storage
A USB-connected Android phone can be visible in Windows File Explorer while remaining unavailable to a browser's File System Access picker because Android commonly exposes storage through MTP. A webpage cannot bypass that OS/browser boundary. If the phone does not appear in the picker, generate the file on the laptop and copy it to the phone, or run the site directly on a compatible phone/browser.

## Security note
Filling free space and then factory-resetting a modern phone is **not a guaranteed secure-erasure procedure** for flash storage because wear-leveling and remapped blocks can retain data outside the logical filesystem. For resale, use the device manufacturer's supported erase/reset process and, where applicable, cryptographic erase.

## Usage
Open `index.html` in a compatible browser or serve the directory with a local/static web server. File System Access features generally require a secure context such as HTTPS or localhost.
