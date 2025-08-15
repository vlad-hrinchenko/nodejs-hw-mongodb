import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();

  // базові middleware
  app.use(cors());
  app.use(pinoHttp());
  app.use(express.json()); // ставимо до роутів

  // опційний healthcheck, щоб / не давав 404
  app.get('/', (req, res) => {
    res.json({ ok: true, service: 'contacts-api', version: '1.0.0' });
  });

  // основні маршрути
  app.use('/contacts', contactsRouter);

  // 404 та глобальна обробка помилок — завжди в кінці
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
