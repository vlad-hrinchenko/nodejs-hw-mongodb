import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

// Конфігурація cloudinary (один раз для всього застосунку)
cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.API_KEY),
  api_secret: getEnvVar(CLOUDINARY.API_SECRET),
});

export const saveFileToCloudinary = async (file) => {
  try {
    // Завантажуємо файл у Cloudinary
    const response = await cloudinary.v2.uploader.upload(file.path);
    // Видаляємо локальний файл після завантаження
    await fs.unlink(file.path);
    // Повертаємо посилання на файл у Cloudinary
    return response.secure_url;
  } catch (err) {
    // Додаємо логування для зручності дебагу
    console.error('Cloudinary upload error:', err);
    throw err;
  }
};