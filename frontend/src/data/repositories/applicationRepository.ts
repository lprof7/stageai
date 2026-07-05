import httpClient from '../api/httpClient';
import type { Application } from '../models';

export async function createApplication(data: {
  cvId: string;
  offerId: string;
  motivationLetter: string;
}): Promise<Application> {
  const res = await httpClient.post('/applications', data);
  return res.data;
}

export async function listApplications(): Promise<Application[]> {
  const res = await httpClient.get('/applications');
  return res.data;
}

export async function getApplication(id: string): Promise<Application> {
  const res = await httpClient.get(`/applications/${id}`);
  return res.data;
}

export async function getMatchAdvice(cvId: string, offerId: string): Promise<{ advice: string }> {
  const res = await httpClient.post('/ai/match-advice', { cvId, offerId });
  return res.data;
}

export async function getMotivationLetter(cvId: string, offerId: string): Promise<{ letter: string }> {
  const res = await httpClient.post('/ai/motivation-letter', { cvId, offerId });
  return res.data;
}

export async function listOfferApplications(offerId: string, status?: string) {
  const res = await httpClient.get(`/company/offers/${offerId}/applications`, {
    params: { status },
  });
  return res.data;
}

export async function getApplicationDetail(id: string) {
  const res = await httpClient.get(`/company/applications/${id}`);
  return res.data;
}

export async function updateApplicationStatus(id: string, status: 'accepted' | 'rejected') {
  const res = await httpClient.put(`/company/applications/${id}/status`, { status });
  return res.data;
}
