
// validate required env vars on startup 
const required = ['GEMINI_API_KEY'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️  Warning: Missing env variable "${key}". Some features won't work.`);
  }
});

const config = {

  // server
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT,10) || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  // gemini ai settings
  gemini: {
    apiKey:          process.env.GEMINI_API_KEY || '',
    model:           'models/gemini-3.1-flash-lite',   // valid v1 model name
    maxOutputTokens: 400,                         // default max response length
    temperature:     0.7,                         // 0 = deterministic, 1 = creative
    requestTimeoutMs: 20000,                      // per-model request timeout
    // fallbackModels: tried in order when the primary model fails (quota/unavailable)
    fallbackModels: [
      'models/gemini-1.5-flash',
      'models/gemini-2.0-flash-lite',
      'models/gemini-2.5-flash',
    ],
  },

  // Orchestration Limits 
  orchestration: {
    tokenBudget: 6000,      // Max total tokens across all 3 agents per request
    timeoutMs:   90000,    // Hard timeout: kill request after _ seconds
    maxRetries:  2,         // Retry a failed agent call up to 2 times
  },
 
  // Rate Limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000,  // 15-minute window
    max:      20,               // Max 20 requests per IP per window
  },
}

export default config;