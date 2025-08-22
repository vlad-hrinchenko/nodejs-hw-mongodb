export const errorHandler = (err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Something went wrong';

  // Обробка помилки MongoDB для некоректного ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid id format';
  }

  res.status(status).json({
    status,
    message,
    data: err.data || null, // Можна залишити err.message, але краще окремо
  });
};
