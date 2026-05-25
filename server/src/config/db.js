import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB connected');
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

export function isDBConnected() {
  return isConnected;
}