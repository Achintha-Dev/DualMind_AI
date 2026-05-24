import rateLimiter from 'express-rate-limit'
import config from '../config/config_index.js'

export const rateLimit = rateLimiter({
    windowMs : config.rateLimit.windowMs,
    max:      config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders:   false,
    message: {
        error: 'Too many requests. Please try again later.',
    }
});