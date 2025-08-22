import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50, trim: true },
    email: { type: String, required: true, minlength: 3, maxlength: 50, lowercase: true },
    phone: { type: String, required: true, trim: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export const Contact = mongoose.model('Contact', contactSchema);
