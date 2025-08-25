import cloudinary from 'cloudinary';
import fs from 'node:fs/promises';
import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';

// Конфігурація Cloudinary
cloudinary.v2.config({
  secure: true,
  cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
  api_key: getEnvVar(CLOUDINARY.CLOUD_API_KEY),
  api_secret: getEnvVar(CLOUDINARY.CLOUD_API_SECRET),
});

/**
 * Завантажує файл на Cloudinary та видаляє локальну копію
 * @param {Object} file - об'єкт файлу, має властивість path
 * @returns {Promise<string>} - URL завантаженого файлу
 */
export const saveFileToCloudinary = async (file) => {
  if (!file?.path) throw new Error('File path is missing');

  const response = await cloudinary.v2.uploader.upload(file.path, {
    folder: 'uploads', // можна змінити на будь-яку директорію в Cloudinary
  });

  await fs.unlink(file.path); // видаляємо локальний файл після завантаження
  return response.secure_url;
};
