import config from '../config/config_index.js';

export function errorHandler( err, req, res, next ){
    const status = err.status || 500;
    const short = err.message.substring(0, 80);
    
    console.error(`❌ [${status}] ${short}`);
    
    // Zod validation errors
    if(err.name === 'ZodError') {
        return res.status(400).json({
            error : err.errors[0]?.message || 'Invalid input!'
        });
    }

    // API errors (AI quota, auth, etc...)
    if(err.message?.includes('API key')) {
        return res.status(401).json({
            error : 'Invalid or missing API key'
        });
    }

    if(err.message?.includes('quota') || err.message?.includes('429')) {
        return res.status(429).json({
            error : 'Chat limit reached. Try again later!'
        });
    }

    if(
        err.message?.toLowerCase().includes('timeout') ||
        err.message?.toLowerCase().includes('timed out')
    ) {
        return res.status(504).json({
            error : err.message
        });
    }
    
    // generic fallback
    const message = config.env === 'production' ? 'Something went wrong. Please try again!' : err.message;
    return res.status(status).json({
        error: err.message.includes('429')
            ? 'Chat limit reached. Try again later!'
            : err.message.substring(0, 120) || 'Internal server error.',
    });
}