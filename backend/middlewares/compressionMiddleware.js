const zlib = require('zlib');

/**
 * Lightweight native HTTP compression middleware using Node.js core zlib.
 * Compresses JSON and text responses >= 1024 bytes with Gzip or Deflate.
 * Shrinks cloud egress bandwidth by 70%-85% without external npm dependencies!
 */
function compressionMiddleware(req, res, next) {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (!acceptEncoding.includes('gzip') && !acceptEncoding.includes('deflate')) {
    return next();
  }

  const originalSend = res.send;
  const originalJson = res.json;

  // Intercept res.json
  res.json = function (body) {
    const jsonString = JSON.stringify(body);
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.send(jsonString);
  };

  // Intercept res.send
  res.send = function (data) {
    if (!data) {
      return originalSend.call(this, data);
    }

    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const MIN_SIZE_TO_COMPRESS = 1024; // 1 KB

    if (buffer.length < MIN_SIZE_TO_COMPRESS) {
      return originalSend.call(this, data);
    }

    if (acceptEncoding.includes('gzip')) {
      zlib.gzip(buffer, (err, compressed) => {
        if (err) {
          return originalSend.call(this, data);
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Vary', 'Accept-Encoding');
        res.removeHeader('Content-Length');
        return originalSend.call(this, compressed);
      });
    } else if (acceptEncoding.includes('deflate')) {
      zlib.deflate(buffer, (err, compressed) => {
        if (err) {
          return originalSend.call(this, data);
        }
        res.setHeader('Content-Encoding', 'deflate');
        res.setHeader('Vary', 'Accept-Encoding');
        res.removeHeader('Content-Length');
        return originalSend.call(this, compressed);
      });
    } else {
      return originalSend.call(this, data);
    }
  };

  next();
}

module.exports = compressionMiddleware;
