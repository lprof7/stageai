import mongoose from 'mongoose';
import { env } from './env';

let cachedConnection: typeof mongoose | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    cachedConnection = conn;
    console.log('MongoDB connected');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export default connectDB;
