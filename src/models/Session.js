import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  accessTokenValidUntil: Date,
  refreshTokenValidUntil: Date,
});

export const Session = mongoose.model('Session', sessionSchema);
