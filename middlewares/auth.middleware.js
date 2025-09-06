import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authMiddleware = (req, res, next) => {
  // 1. Перевіряємо, чи є заголовок Authorization
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // 2. Розділяємо заголовок на "Bearer" і сам токен
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    // 3. Перевіряємо токен за допомогою нашого секретного ключа
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Додаємо розшифровану інформацію (ID користувача) до об'єкта запиту
    req.user = decoded;
    // 4. Якщо все добре, передаємо управління наступній функції
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};