import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  contactType: String,
  isFavourite: { type: Boolean, default: false },
});

export const Contact = mongoose.model('Contact', contactSchema);
