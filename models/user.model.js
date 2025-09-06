import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email є обовʼязковим'],
      unique: true, // Кожен email має бути унікальним
      trim: true,
      lowercase: true, // Завжди зберігаємо email в нижньому регістрі
    },
    password: {
      type: String,
      required: [true, 'Пароль є обовʼязковим'],
      minlength: 6, // Мінімальна довжина пароля
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
// Middleware, яка виконується ПЕРЕД збереженням
userSchema.pre('save', async function (next) {
  // Якщо пароль не було змінено, нічого не робимо
  if (!this.isModified('password')) {
    return next();
  }

  // "Солимо" пароль, щоб зробити його ще безпечнішим
  const salt = await bcrypt.genSalt(10);
  // Хешуємо пароль з використанням "солі"
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const User = model('user', userSchema);

export default User;
