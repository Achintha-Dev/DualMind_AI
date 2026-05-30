import { z } from 'zod';
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserById,
} from '../services/authService.js';

// Validation schemas 

const registerSchema = z.object({
  name:     z.string().min(2).max(80).trim(),
  email:    z.email().trim()
            .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter valid email.'),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
            .regex(/[A-Z]/, 'Must contain uppercase letter')
            .regex(/[0-9]/, 'Must contain a number'),
});

const loginSchema = z.object({
  email:    z.email().trim(),
  password: z.string().min(1),
});

// Controllers 

/** POST /api/auth/register */
export async function register(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error:parsed.error.issues[0]?.message || 'Invalid input.',
      });
    }

    const { user, token } = await registerUser(parsed.data);

    console.log(`👤 New user registered: ${user.email}`);

    const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
    };

    return res.status(201).json({
      user:  safeUser,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message || 'Registration failed. Please try again.' });
  }
}

/** POST /api/auth/login */
export async function login(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const { user, token } = await loginUser(parsed.data);

    console.log(`🔐 User logged in: ${user.email}`);

    const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
    };

    return res.json({
      user:  safeUser,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }
}

/** POST /api/auth/google */
export async function googleAuth(req, res) {
  try {
    const schema = z.object({
        idToken: z.string().min(10),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: 'Google ID token is required.' });
    }

    const { user, token } = await googleLogin(parsed.data.idToken);

    console.log(`🔐 Google login: ${user.email}`);

    const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
    };

    return res.json({
      user:  safeUser,
      token,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
}

/** GET /api/auth/me  (protected) */
export async function getMe(req, res) {
  try {
    const user = await getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const safeUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        provider: user.provider,
    };
    return res.json({ user: safeUser });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch user data.' });
  }
}