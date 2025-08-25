// index.js
import 'dotenv/config'; // ✅ обов'язково першим рядком

import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { getEnvVar } from './utils/getEnvVar.js';

console.log('Loaded CLOUD_NAME:', getEnvVar('CLOUD_NAME')); // перевірка

(async () => {
  try {
    await initMongoConnection();
    await createDirIfNotExists(TEMP_UPLOAD_DIR);
    await createDirIfNotExists(UPLOAD_DIR);

    setupServer();
    console.log('App is starting...');
  } catch (err) {
    console.error('Bootstrap error:', err);
  }
})();
