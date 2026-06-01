import 'dotenv/config';

// Validate required env vars on startup
const required = ['GEMINI_API_KEY'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: Missing env variable "${key}". Some features won't work.`);
  }
});

const config = {

  // server
  env:       process.env.NODE_ENV,
  port:      parseInt(process.env.PORT, 10) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',

  // Auth
  auth: {
    jwtSecret:      process.env.JWT_SECRET || 'change_this_secret',
    jwtExpiresIn:   process.env.JWT_EXPIRES_IN || '7d',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  },

  // Gemini AI settings
  gemini: {
    apiKey:           process.env.GEMINI_API_KEY || '',
    model:            'models/gemini-2.5-flash-lite',  // primary — fast & cheap
    maxOutputTokens:  1200,
    temperature:      0.7,
    requestTimeoutMs: 20000,
    // Fallbacks tried in order when primary fails (quota / unavailable)
    fallbackModels: [
      'models/gemini-2.5-flash',
      'models/gemini-2.0-flash',
    ],
  },

  // Orchestration limits
  orchestration: {
    tokenBudget: 15000,   // Max total tokens across all 3 agents per request
    timeoutMs:   120000,  // Hard timeout: kill request after 120 seconds
    maxRetries:  2,       // Retry a failed agent call up to 2 times
  },

  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,  // 15-minute window
    max:      20,               // Max 20 requests per IP per window
  },
};

export default config;