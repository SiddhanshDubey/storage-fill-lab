# Storage Fill Lab

Browser-based generator for large local test files.

## Features
- Generate TXT files with configurable target size.
- Generate simple PDF-compatible filler output.
- Payload modes: mixed text, zeros, hex-like data, and random bytes.
- Progress, throughput-friendly chunking, and stop control.
- Optional external-storage destination using the browser File System Access API.
- No server-side upload or storage.

## External / phone storage
On supported browsers, choose **External / phone storage** and select a destination folder. A USB-connected phone may appear in the operating system but remain inaccessible to the browser when exposed through MTP. This is a browser/OS limitation, not something a webpage can bypass.

## Security note
Filling free space and then factory-resetting a modern phone is **not a guaranteed secure-erasure procedure** for flash storage because wear-leveling and remapped blocks can retain data outside the logical filesystem. For resale, use the device manufacturer's supported erase/reset process and, where applicable, cryptographic erase.

## Usage
Open `index.html` in a compatible browser or serve the directory with a local/static web server. File System Access features generally require a secure context such as HTTPS or localhost.
