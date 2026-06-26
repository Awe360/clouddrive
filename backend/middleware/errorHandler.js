/**
 * Global Express Error Handler
 */
function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', err);

  // Multer limit exceeded error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'File size limit exceeded. Maximum file size allowed is 50MB.'
    });
  }

  // Token errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token. Access denied.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Session expired. Please log in again.'
    });
  }

  // Default server error
  const status = err.statusCode || 500;
  const message = err.message || 'An unexpected database or server error occurred.';

  res.status(status).json({
    error: message,
    // Do not expose stack trace in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
