// src/middlewares/notFoundHandler.js
import createHttpError from 'http-errors';

/**
 * Middleware для обробки неіснуючих маршрутів (404)
 */
export const notFoundHandler = (req, res, next) => {
  // Створюємо помилку 404 з повідомленням
  next(createHttpError(404, `Resource not found - ${req.originalUrl}`));
};
