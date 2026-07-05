import httpClient from '../api/httpClient';
import type { AuthResponse } from '../models';

export async function registerStudent(data: {
  fullName: string;
  email: string;
  password: string;
  onboardingMethod: 'upload' | 'manual';
}): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/student/register', data);
  return res.data;
}

export async function loginStudent(email: string, password: string): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/student/login', { email, password });
  return res.data;
}

export async function registerCompany(data: {
  name: string;
  email: string;
  password: string;
  description?: string;
  location?: string;
}): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/company/register', data);
  return res.data;
}

export async function loginCompany(email: string, password: string): Promise<AuthResponse> {
  const res = await httpClient.post('/auth/company/login', { email, password });
  return res.data;
}
