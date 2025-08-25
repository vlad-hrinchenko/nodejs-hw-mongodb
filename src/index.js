import { config } from 'dotenv';
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';

config();

(async () => {
  await initMongoConnection();
  setupServer();
  console.log("App is starting...");
})();
