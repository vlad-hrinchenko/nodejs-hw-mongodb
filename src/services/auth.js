import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Оновлення сесії (refresh token)
export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not found');
  }
  
  // Знаходимо сесію по refreshToken
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  // Перевіряємо дійсність токена
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  // Знаходимо користувача
  const user = await User.findById(payload.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // Створюємо нові токени
  const newPayload = { userId: user._id };
  const newAccessToken = jwt.sign(newPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign(newPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  // Видаляємо старий refreshToken
  await Session.deleteOne({ _id: session._id });

  // Створюємо нову сесію
  await Session.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Логаут користувача (видаляємо конкретну сесію)
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not found');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  await Session.deleteOne({ _id: session._id });
  return;
};
