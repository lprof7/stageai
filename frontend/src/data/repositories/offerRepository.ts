import httpClient from '../api/httpClient';
import type { Offer } from '../models';

export async function listOffers(params?: {
  search?: string;
  paymentType?: string;
  employmentType?: string;
  cvId?: string;
}): Promise<Offer[]> {
  const res = await httpClient.get('/offers', { params });
  return res.data;
}

export async function getOffer(id: string, cvId?: string): Promise<Offer> {
  const res = await httpClient.get(`/offers/${id}`, { params: { cvId } });
  return res.data;
}

export async function listCompanyOffers(): Promise<Offer[]> {
  const res = await httpClient.get('/company/offers');
  return res.data;
}

export async function createOffer(data: {
  title: string;
  description: string;
  paymentType: string;
  employmentType: string;
  requiredSkills: string[];
  durationMonths?: number;
  location?: string;
}): Promise<Offer> {
  const res = await httpClient.post('/company/offers', data);
  return res.data;
}

export async function getCompanyOffer(id: string): Promise<Offer> {
  const res = await httpClient.get(`/company/offers/${id}`);
  return res.data;
}

export async function updateCompanyOffer(id: string, data: Partial<Offer>): Promise<Offer> {
  const res = await httpClient.put(`/company/offers/${id}`, data);
  return res.data;
}
