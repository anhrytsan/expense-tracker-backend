import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Перевіряємо, чи не існує вже користувач з таким email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // Якщо так, повертаємо помилку 409 Conflict
      return res
        .status(409)
        .json({ message: "Користувач з таким email вже існує!" });
    }

    // 2. Створюємо нового користувача
    // Пароль автоматично хешується завдяки нашій middleware у моделі User
    const newUser = await User.create({ email, password });

    // 3. Відправляємо відповідь, але без пароля
    res.status(201).json({
      user: {
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка на сервері", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Такого користувача не існує в базі даних" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Неправильний пароль!" });
    }

    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({
      token,
      user: {
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Помилка на сервері", error: error.message });
  }
};
