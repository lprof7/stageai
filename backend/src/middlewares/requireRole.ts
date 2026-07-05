import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      console.warn('[requireRole] req.user is null, roles required:', roles);
      return res.status(401).json({ message: 'Not authenticated' });
    }
    console.log('[requireRole] user role=%s, required roles=%s', req.user.role, roles.join(','));
    if (!roles.includes(req.user.role)) {
      console.warn('[requireRole] role %s not in %s', req.user.role, roles.join(','));
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}
