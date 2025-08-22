import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not found');
  }
  
  // Знаходимо сесію
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }
    

  // Перевіряємо дійсність токена
  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  // Знаходимо користувача
  const user = await User.findById(payload.userId);
  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // Видаляємо стару сесію
  await Session.deleteMany({ userId: user._id });

  // Створюємо нові токени
  const newPayload = { userId: user._id };
  const newAccessToken = jwt.sign(newPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign(newPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 хв
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  await Session.create({
    userId: user._id,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    throw createHttpError(401, 'Refresh token not found');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Invalid refresh token');
  }

  // Видаляємо сесію
  await Session.deleteOne({ _id: session._id });
};


