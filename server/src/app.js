import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { connectDB } from './config/db.js';

import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { authenticate } from './middleware/authenticate.js';
import { errorHandler } from './utils/errorHandler.js';
import { rateLimit } from './utils/rateLimiter.js';
import imageRoutes from './routes/imageRoutes.js';


const app = express();
connectDB();

// Security and logging
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS — must include DELETE for history endpoints
app.use(cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'https://dual-mind-ai-kappa.vercel.app',],
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10kb' }));

// Rate limiter (uncomment to enable)
// app.use('/api/', rateLimit);

// Health check
app.get('/health', (__, res) => {
    res.status(200).json({
        message: 'Health is good',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', authenticate, historyRoutes);
app.use('/api/image', imageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

export default app;