import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email є обовʼязковим'],
      unique: true,
      trim: true,
      lowercase: true, // Always store email in lowercase
    },
    password: {
      type: String,
      required: [true, 'Пароль є обовʼязковим'],
      minlength: 6,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified('password')) {
    return next();
  }

  // Salt and hash the password
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = model('user', userSchema);

export default User;
