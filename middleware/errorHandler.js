export function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    msg: err.message || "Something went wrong",
  });
}
