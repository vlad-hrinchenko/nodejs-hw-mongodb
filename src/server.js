import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors({ origin: true, credentials: true })); // для cookie
  app.use(pino());
  app.use(express.json());
  app.use(cookieParser());

  // API маршрути з префіксом /api
  app.use('/api/auth', authRouter);
  app.use('/api/contacts', contactsRouter);

  // Обробка неіснуючих маршрутів
  app.use(notFoundHandler);

  // Централізований обробник помилок
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
