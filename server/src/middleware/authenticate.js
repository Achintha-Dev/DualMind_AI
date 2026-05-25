import { verifyToken } from '../services/authService.js';

/**
 * JWT Authentication Middleware
 * Protects private routes.
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required.',
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify JWT
    const payload = verifyToken(token);

    // Attach authenticated user ID
    req.userId = payload.sub;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error.message);

    return res.status(401).json({
      error: 'Invalid or expired token. Please log in again.',
    });
  }
}