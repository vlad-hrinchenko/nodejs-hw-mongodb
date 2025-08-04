import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import { getContactsController, getContactByIdController } from './controllers/contactsController.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());

  // Роути
  app.get('/contacts', getContactsController);
  app.get('/contacts/:contactId', getContactByIdController); 

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  return app;
}