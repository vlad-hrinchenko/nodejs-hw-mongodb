import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';
import { Session } from '../models/Session.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh-secret';

// Реєстрація
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(409, 'Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    next(err);
  }
};

// Логін
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, 'Invalid email or password');

    const payload = { userId: user._id };
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
    const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    });

    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

// Оновлення токенів
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError(401, 'Refresh token missing');

    const session = await Session.findOne({ refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    const payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) throw createHttpError(401, 'User not found');

    // Видаляємо старі сесії
    await Session.deleteMany({ userId: user._id });

    // Створюємо нові токени
    const newPayload = { userId: user._id };
    const newAccessToken = jwt.sign(newPayload, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
    const newRefreshToken = jwt.sign(newPayload, REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    await Session.create({
      userId: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
      refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
};

// Логаут
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError(401, 'Refresh token missing');

    const session = await Session.findOne({ refreshToken });
    if (!session) throw createHttpError(401, 'Invalid refresh token');

    await Session.deleteOne({ _id: session._id });
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};
