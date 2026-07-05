import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import Student from '../models/Student';
import Company from '../models/Company';

const SALT_ROUNDS = 10;

export function generateToken(id: string, role: 'student' | 'company' | 'admin'): string {
  return jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: '7d' });
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function registerStudent(data: {
  fullName: string;
  email: string;
  password: string;
  onboardingMethod: 'upload' | 'manual';
  phone?: string;
  location?: string;
  education?: string;
  bio?: string;
}) {
  const existing = await Student.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw { status: 409, message: 'Email already registered' };
  }
  const passwordHash = await hashPassword(data.password);
  const student = await Student.create({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    passwordHash,
    onboardingMethod: data.onboardingMethod,
    phone: data.phone || '',
    location: data.location || '',
    education: data.education || '',
    bio: data.bio || '',
  });
  const token = generateToken(student._id.toString(), student.role);
  return { token, student: { id: student._id, fullName: student.fullName, email: student.email, role: student.role } };
}

export async function loginStudent(email: string, password: string) {
  const student = await Student.findOne({ email: email.toLowerCase() });
  if (!student) {
    throw { status: 401, message: 'Invalid email or password' };
  }
  const valid = await comparePassword(password, student.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Invalid email or password' };
  }
  const token = generateToken(student._id.toString(), student.role);
  return { token, student: { id: student._id, fullName: student.fullName, email: student.email, role: student.role } };
}

export async function registerCompany(data: {
  name: string;
  email: string;
  password: string;
  description?: string;
  location?: string;
}) {
  const existing = await Company.findOne({ email: data.email.toLowerCase() });
  if (existing) {
    throw { status: 409, message: 'Email already registered' };
  }
  const passwordHash = await hashPassword(data.password);
  const company = await Company.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    description: data.description || '',
    location: data.location || '',
    status: 'pending',
  });
  const token = generateToken(company._id.toString(), 'company');
  return { token, company: { id: company._id, name: company.name, email: company.email, status: company.status } };
}

export async function loginCompany(email: string, password: string) {
  const company = await Company.findOne({ email: email.toLowerCase() });
  if (!company) {
    throw { status: 401, message: 'Invalid email or password' };
  }
  const valid = await comparePassword(password, company.passwordHash);
  if (!valid) {
    throw { status: 401, message: 'Invalid email or password' };
  }
  const token = generateToken(company._id.toString(), 'company');
  return { token, company: { id: company._id, name: company.name, email: company.email, status: company.status } };
}
