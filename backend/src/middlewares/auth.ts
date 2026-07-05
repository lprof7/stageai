import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthPayload {
  id: string;
  role: 'student' | 'company' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  console.log('[auth] Authorization header:', header ? `${header.substring(0, 30)}...` : 'MISSING');
  if (!header || !header.startsWith('Bearer ')) {
    console.warn('[auth] No token provided, header:', header);
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    console.log('[auth] Token verified, payload:', JSON.stringify(payload));
    req.user = payload;
    next();
  } catch (err) {
    console.warn('[auth] Invalid token:', err);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
