import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getContactsController } from './controllers/contactsController.js';

export function setupServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pinoHttp());

  // Роут: GET /contacts
  app.get('/contacts', getContactsController);

  // Обробка неіснуючих маршрутів
  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}
