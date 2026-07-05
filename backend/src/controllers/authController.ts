import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import {
  registerStudentSchema,
  loginSchema,
  registerCompanySchema,
} from '../utils/validators/authValidators';

export async function registerStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerStudentSchema.parse(req.body);
    const result = await authService.registerStudent(data);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function loginStudent(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.loginStudent(email, password);
    res.json(result);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function registerCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const data = registerCompanySchema.parse(req.body);
    const result = await authService.registerCompany(data);
    res.status(201).json(result);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}

export async function loginCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await authService.loginCompany(email, password);
    res.json(result);
  } catch (err: any) {
    if (err.issues) return res.status(400).json({ message: 'Validation error', details: err.issues });
    next(err);
  }
}
