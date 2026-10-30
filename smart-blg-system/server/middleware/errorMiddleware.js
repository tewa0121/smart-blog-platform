exports.notFound = (req, res) =>
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });

exports.errorHandler = (err, req, res, next) => {
  console.error(err.message);
  const status = err.code === 'LIMIT_FILE_SIZE' ? 400 : res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status === 200 ? 500 : status).json({ message: err.message || 'Server error' });
};