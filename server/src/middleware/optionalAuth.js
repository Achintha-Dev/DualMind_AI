import { verifyToken } from '../services/authService.js';

export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  // No token -> continue as guest
  if (!authHeader?.startsWith('Bearer ')) {
    req.userId = null;
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);

    req.userId = payload.sub;
    next();

  } catch (err) {
    // Invalid token -> still continue as guest
    req.userId = null;
    next();
  }
}