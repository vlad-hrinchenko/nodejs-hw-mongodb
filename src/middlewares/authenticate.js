import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { User } from '../models/User.js';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access-secret';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw createHttpError(401, 'Authorization header missing or malformed');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err) {
      const message = err.name === 'TokenExpiredError'
        ? 'Access token expired'
        : 'Invalid access token';
      throw createHttpError(401, message);
    }

    const user = await User.findById(payload.userId);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
