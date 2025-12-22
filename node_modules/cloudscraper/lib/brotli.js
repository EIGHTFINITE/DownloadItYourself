'use strict';

const zlib = require('zlib');

const brotli = module.exports;
// Convenience boolean used to check for brotli support
brotli.isAvailable = false;

// Check for node's built-in brotli support
if (typeof zlib.brotliDecompressSync === 'function') {
  brotli.decompress = function (buf) {
    return zlib.brotliDecompressSync(buf);
  };

  brotli.isAvailable = true;
}
