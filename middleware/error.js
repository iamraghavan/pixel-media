
export function logErrors (err, req, res, next) {
  console.error(err.stack)
  next(err)
}

export function errorHandler (err, req, res, next) {
  res.status(500).json({ error: 'Something failed!' })
}
