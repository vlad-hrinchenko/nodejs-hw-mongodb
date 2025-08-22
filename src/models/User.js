import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 3,
      maxlength: 50,
      trim: true, // прибирає зайві пробіли
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true, // всі email в нижньому регістрі
      match: /^\S+@\S+\.\S+$/, // перевірка на email
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
