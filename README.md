# Storage Fill Lab

Lightweight browser-based generator for large local test files.

## Current architecture
- TXT generation with configurable target size.
- Experimental PDF mode.
- Payload modes: mixed text, zeros, hex-like data, and random bytes.
- Generation runs in `generator-worker.js` when Web Workers are available, with bounded backpressure.
- Reusable fixed-size buffers keep memory use predictable.
- Direct large-file saving through the File System Access API when supported.
- Automatic device/browser capability profiling and performance selection.
- Legacy-compatible fallback when direct file saving is unavailable.
- No server-side upload or storage.

## Automatic compatibility detection
The page locally detects:
- Browser family and version from the User-Agent and, where available, User-Agent Client Hints.
- Operating system and version when exposed by the browser.
- Android device model when available from high-entropy User-Agent Client Hints.
- Approximate RAM (`navigator.deviceMemory`) when exposed.
- Logical CPU count (`navigator.hardwareConcurrency`).
- File System Access API support.
- Web Worker support.

Feature detection is authoritative for selecting the actual code path; browser names and versions are diagnostic information only. This follows the web-platform recommendation that feature detection is more reliable than User-Agent sniffing.

No location, camera, microphone, contacts, or similar permissions are requested for these diagnostics. Some browsers may simply decline to expose detailed hardware/model information.

## Large-file testing
For 100–200 GB tests, use **Automatic** or **Save directly** in a browser that exposes the File System Access API. The generator writes chunks incrementally and does not construct a 100–200 GB JavaScript object in memory.

When that API is unavailable, a webpage cannot reliably create a single arbitrarily large user-visible file on the device. The fallback therefore favors compatibility and smaller test files rather than pretending that an unsupported browser can perform a direct large-file write.

Performance modes:
- **Automatic**: selects Eco/Balanced/Maximum using device capabilities and whether the device is mobile.
- **Eco**: 1 MiB chunks for older/slower devices.
- **Balanced**: 4 MiB chunks.
- **Maximum throughput**: 16 MiB chunks.

## USB / phone storage
A USB-connected Android phone can be visible in Windows File Explorer while remaining unavailable to a browser's File System Access picker because Android commonly exposes storage through MTP. A webpage cannot bypass that OS/browser boundary. If the phone does not appear in the picker, generate the file on the laptop and copy it to the phone, or run the site directly on a compatible phone/browser.

## Browser support notes
The File System Access API is not universal. Current Chromium-based browsers support the relevant picker APIs, while Firefox does not implement `showSaveFilePicker()` and Safari does not provide the same general direct-save workflow. Compatibility therefore uses capability detection rather than assuming that a particular browser family works.

## Security note
Filling free space and then factory-resetting a modern phone is **not a guaranteed secure-erasure procedure** for flash storage because wear-leveling and remapped blocks can retain data outside the logical filesystem. For resale, use the device manufacturer's supported erase/reset process and, where applicable, cryptographic erase.

## Usage
Open `index.html` in a compatible browser or serve the directory with a local/static web server. File System Access features generally require a secure context such as HTTPS or localhost.
