import express from 'express';
import cors from 'cors';
import pinoHttp from 'pino-http';
import contactsRouter from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pinoHttp());

  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler); 
  app.use(errorHandler);      
  app.use(express.json()); 

  return app;
}
