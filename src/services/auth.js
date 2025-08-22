import { User } from '../models/User.js';
import { Session } from '../models/Session.js';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

export const registerUser = async ({ email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email already in use');

  const user = await User.create({ email, password });
  const payload = { userId: user._id };

  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.create({ userId: user._id, accessToken, refreshToken });

  return { accessToken, refreshToken };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Invalid credentials');

  const isValid = await user.comparePassword(password);
  if (!isValid) throw createHttpError(401, 'Invalid credentials');

  const payload = { userId: user._id };
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.create({ userId: user._id, accessToken, refreshToken });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'Refresh token missing');
  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, 'Invalid refresh token');

  let payload;
  try { payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET); }
  catch { throw createHttpError(401, 'Invalid refresh token'); }

  const user = await User.findById(payload.userId);
  if (!user) throw createHttpError(401, 'User not found');

  await Session.deleteMany({ userId: user._id });

  const newPayload = { userId: user._id };
  const accessToken = jwt.sign(newPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const newRefreshToken = jwt.sign(newPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

  await Session.create({ userId: user._id, accessToken, refreshToken: newRefreshToken });

  return { accessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw createHttpError(401, 'Refresh token missing');
  await Session.deleteOne({ refreshToken });
};
