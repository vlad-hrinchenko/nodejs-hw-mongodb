import { registerUser, loginUser, refreshSession, logoutUser } from '../services/auth.js';
import createHttpError from 'http-errors';

export const register = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await registerUser(req.body);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = await loginUser(req.body);
    res.json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshSession(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await logoutUser(refreshToken);
    res.json({ message: 'Logged out' });
  } catch (err) {
    next(err);
  }
};
