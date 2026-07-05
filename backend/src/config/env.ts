import dotenv from 'dotenv';
dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: requireEnv('MONGODB_URI'),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  GROQ_API_KEY: requireEnv('GROQ_API_KEY'),
  IMAGEKIT_PUBLIC_KEY: requireEnv('IMAGEKIT_PUBLIC_KEY'),
  IMAGEKIT_PRIVATE_KEY: requireEnv('IMAGEKIT_PRIVATE_KEY'),
  IMAGEKIT_URL_ENDPOINT: requireEnv('IMAGEKIT_URL_ENDPOINT'),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
