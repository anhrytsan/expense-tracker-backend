import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const authMiddleware = (req, res, next) => {
  // 1. Check if the Authorization header is present
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  // 2. Split the header to get the token
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    // 3. Check and verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Add decoded user info to request object
    req.user = decoded;
    // 4. If valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};