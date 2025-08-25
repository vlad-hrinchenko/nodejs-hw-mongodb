
import createHttpError from 'http-errors';

export const notFoundHandler = (req, res, next) => {

  next(createHttpError(404, `Resource not found - ${req.originalUrl}`));
};
