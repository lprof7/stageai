import Groq from 'groq-sdk';
import { env } from './env';

export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export const GROQ_MODEL = 'qwen/qwen3.6-27b';

export default groq;
