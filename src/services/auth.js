import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import User from '../db/models/userModel.js';
import Session from '../db/models/sessionModel.js';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your-access-token-secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-token-secret';
const ACCESS_TOKEN_LIFETIME = 15 * 60; // 15 хвилин
const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60; // 30 днів

export async function registerUser({ name, email, password }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashedPassword });

  const { password: _, ...userData } = user.toObject();
  return userData;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) throw createHttpError(401, 'Email or password is wrong');

  await Session.deleteMany({ userId: user._id });

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_TOKEN_LIFETIME * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_TOKEN_LIFETIME * 1000);

  await Session.create({ userId: user._id, accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil });

  return { accessToken, refreshToken, userId: user._id };
}

export async function refreshSession(refreshToken) {
  if (!refreshToken) throw createHttpError(401, 'Refresh token is missing');

  let payload;
  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const userId = payload.id;
  const user = await User.findById(userId);
  if (!user) throw createHttpError(401, 'User not found');

  const session = await Session.findOne({ userId, refreshToken });
  if (!session) throw createHttpError(401, 'Session not found or has been revoked');

  await Session.deleteMany({ userId });

  const newAccessToken = jwt.sign({ id: userId }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFETIME });
  const newRefreshToken = jwt.sign({ id: userId }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_LIFETIME });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_TOKEN_LIFETIME * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_TOKEN_LIFETIME * 1000);

  await Session.create({
    userId,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function logoutUser({ refreshToken }) {
  if (!refreshToken) throw createHttpError(401, 'Refresh token is missing');

  const session = await Session.findOne({ refreshToken });
  if (!session) throw createHttpError(401, 'Session not found or token is invalid');

  await Session.deleteOne({ _id: session._id });
}
import createHttpError from "http-errors";
import { User} from '../db/models/user.Model.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { Session } from "../db/models/sessionModel.js";

export const registerUser = async (payload) => {
 const existingUser = await User.findOne({email: payload.email});

 if(existingUser) {
    throw createHttpError(409, "User already created");
 }

 const hashedPassword = await bcrypt.hash(payload.password, 10);
 const user = await User.create({
    ...payload,
    password: hashedPassword});

 return user;
}

export const loginUser = async (payload) => {
 const user = await User.findOne({email: payload.email});

 if(!user) {
    throw createHttpError(401, 'User not found');
 }
 const isEqual = await bcrypt.compare(payload.password, user.password);
 if(!isEqual) {
    throw createHttpError(401, 'User not found');
 }

 await Session.findOneAndDelete({ userId: user._id });

 const session = await Session.create({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 1000 * 60 * 15),
    refreshTokenValidUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    userId: user._id,
    });
 return session;
}

export const refreshSession = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: session._id });

  const newSession = await Session.create({
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: session.userId,
  });

  return {
    accessToken: newSession.accessToken,
    refreshToken: newSession.refreshToken,
    sessionId: newSession._id,
    accessTokenValidUntil: newSession.accessTokenValidUntil,
    refreshTokenValidUntil: newSession.refreshTokenValidUntil,
  };
};

export const logoutUser = async (refreshToken) => {
    await Session.deleteOne({ refreshToken });
};