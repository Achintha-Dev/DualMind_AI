import { Router } from 'express';

import {
  register,
  login,
  googleAuth,
  getMe,
  logout,
} from '../controllers/authController.js';

import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * Public Routes
 */
router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/logout', logout);

/**
 * Protected Routes
 */
router.get('/me', authenticate, getMe);

export default router;