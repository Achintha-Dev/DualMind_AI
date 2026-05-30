import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import { connectDB }     from './config/db.js';

import chatRoutes from './routes/chatRoutes.js'
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import { authenticate } from './middleware/authenticate.js';
import { errorHandler } from './utils/errorHandler.js'
import { rateLimit } from './utils/rateLimiter.js';

const app = express();
connectDB();

// security and login
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// cors
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// body parser
app.use(express.json( { limit:'10kb' } ));

// rate limit
// app.use('/api/', rateLimit);

// health check
app.get('/health',(__, res) => {
    res.status(200).json({
        message: 'Health is good',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// API Routes 
// Public routes 
app.use('/api/chat', chatRoutes);

// Protected routes — JWT required 
app.use('/api/auth', authRoutes);
app.use('/api/history', authenticate, historyRoutes);

// 404 handler
app.use((req, res) =>{
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// global error handler
app.use(errorHandler);

export default app;