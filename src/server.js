import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import authRoutes from './routers/auth.js';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

export function setupServer() {
  const app = express();

  // Розпарсити cookies перед роутами
  app.use(cookieParser());

  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json());

  // Роут для аутентифікації
  app.use('/auth', authRoutes);

  // Роут для контактів
  app.use('/contacts', contactsRouter);

  // 404
  app.use(notFoundHandler);

  // Глобальний обробник помилок
  app.use(errorHandler);

  return app;
}
