import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/user.js';
import config from '../config/config_index.js';

const googleClient = new OAuth2Client(config.auth.googleClientId);

// JWT helpers 

export function signToken(userId) {
    try {
        return jwt.sign(
        { 
            sub: userId,
            typ: 'access'
        },
            config.auth.jwtSecret,
            { 
                expiresIn: config.auth.jwtExpiresIn,
                issuer: 'dualmind-ai',
            }
        );
        
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, config.auth.jwtSecret);
        
    } catch (error) {
        throw Object.assign(new Error('Invalid or expired token.'), { status: 401 });
    }
}

// Email / Password 

export async function registerUser({ name, email, password }) {
    try {
        const existing = await User.findOne({ email });
        if (existing) {
          throw Object.assign(new Error('An account with this email already exists.'), { status: 409 });
        }
      
        const user = await User.create({ name, email, password, provider: 'local' });
        const token = signToken(user._id);
        return { user, token };
        
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export async function loginUser({ email, password }) {
    try {
        // Explicitly select password (it's excluded by default)
        const user = await User.findOne({ email }).select('+password');
      
        if (!user || user.provider !== 'local') {
          throw Object.assign(
            new Error('Invalid email or password.'),
            { status: 401 }
          );
        }

        const valid = await user.comparePassword(password);
        if (!valid) {
          throw Object.assign(new Error('Invalid email or password.'), { status: 401 });
        }
      
        const token = signToken(user._id);
        return { user, token };

    } catch (error) {
        console.error(error.message);
        throw error;
    }

}

// Google OAuth 

export async function googleLogin(idToken) {
    try {
        
        // Verify token with Google
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: config.auth.googleClientId,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;
        
        if (!email) {
            throw Object.assign(
                new Error('Google account email not available'),
                { status: 400 }
            );
        }

        // Find existing user or create one
        let user = await User.findOne({ $or: [{ googleId }, { email }] });
      
        if (user) {
          // Link Google ID if they previously registered with email
          if (!user.googleId) {
            user.googleId = googleId;
            user.provider  = 'google';
            user.avatar    = picture;
            await user.save();
          }
        } else {
          user = await User.create({
            name,
            email,
            googleId,
            avatar:   picture,
            provider: 'google',
          });
        }
      
        const token = signToken(user._id);
        return { user, token };

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

// Get current user by ID (used in auth middleware)

export async function getUserById(id) {
    try{
        return User.findById(id);

    } catch (error) {
        console.error(error.message);
        throw error;
    }
}